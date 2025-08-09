import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Types
interface ActivityData {
  userId: string;
  timestamp: admin.firestore.Timestamp;
  activityType: 'coding' | 'debugging' | 'file_operation' | 'inactivity';
  projectName: string;
  filePath: string;
  metadata?: {
    language?: string;
    fileSize?: number;
    linesChanged?: number;
  };
}

interface ProcessedActivity extends ActivityData {
  isProductive: boolean;
  sessionId: string;
  duration?: number;
}

interface SessionData {
  sessionId: string;
  userId: string;
  projectName: string;
  startTime: admin.firestore.Timestamp;
  endTime?: admin.firestore.Timestamp;
  totalDuration: number;
  productiveTime: number;
  wastedTime: number;
  activities: ProcessedActivity[];
  productivityScore: number;
  filesModified: string[];
  languages: string[];
}

// Activity Classification Logic
function classifyActivity(activity: ActivityData): boolean {
  const { activityType, filePath, metadata } = activity;
  
  // Productive activities
  if (activityType === 'coding') {
    // Check if it's a meaningful code file
    const codeExtensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.go', '.rs', '.php', '.rb'];
    const isCodeFile = codeExtensions.some(ext => filePath.endsWith(ext));
    
    if (isCodeFile) {
      // Consider it productive if there are meaningful changes
      return metadata?.linesChanged ? metadata.linesChanged > 0 : true;
    }
    
    // Configuration files are moderately productive
    const configExtensions = ['.json', '.yml', '.yaml', '.toml', '.ini', '.env'];
    if (configExtensions.some(ext => filePath.endsWith(ext))) {
      return true;
    }
    
    return false;
  }
  
  if (activityType === 'debugging') {
    return true; // Debugging is generally productive
  }
  
  if (activityType === 'file_operation') {
    // File operations on code files are productive
    const productiveExtensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.go', '.rs', '.php', '.rb', '.html', '.css', '.scss'];
    return productiveExtensions.some(ext => filePath.endsWith(ext));
  }
  
  // Inactivity is not productive
  return false;
}

// Generate session ID based on time gaps
function generateSessionId(userId: string, timestamp: admin.firestore.Timestamp): string {
  const date = timestamp.toDate();
  const sessionStart = new Date(date);
  sessionStart.setMinutes(Math.floor(date.getMinutes() / 30) * 30, 0, 0); // 30-minute sessions
  return `${userId}_${sessionStart.getTime()}`;
}

// Calculate productivity score
function calculateProductivityScore(session: Partial<SessionData>): number {
  if (!session.totalDuration || session.totalDuration === 0) return 0;
  
  const productiveRatio = (session.productiveTime || 0) / session.totalDuration;
  const baseScore = productiveRatio * 100;
  
  // Bonus for longer focused sessions
  const durationBonus = Math.min((session.totalDuration / (60 * 60 * 1000)) * 5, 20); // Up to 20 points for 4+ hour sessions
  
  // Penalty for very short sessions
  const durationPenalty = session.totalDuration < (15 * 60 * 1000) ? 10 : 0; // 10 point penalty for sessions under 15 minutes
  
  return Math.max(0, Math.min(100, baseScore + durationBonus - durationPenalty));
}

// Main function to process activity data
export const processActivity = functions.firestore
  .document('activities/{activityId}')
  .onCreate(async (snap, context) => {
    try {
      const activityData = snap.data() as ActivityData;
      const activityId = context.params.activityId;
      
      // Classify the activity
      const isProductive = classifyActivity(activityData);
      const sessionId = generateSessionId(activityData.userId, activityData.timestamp);
      
      // Create processed activity
      const processedActivity: ProcessedActivity = {
        ...activityData,
        isProductive,
        sessionId
      };
      
      // Update the activity document with processed data
      await snap.ref.update({
        isProductive,
        sessionId,
        processed: true,
        processedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Update or create session data
      await updateSessionData(processedActivity);
      
      // Update user statistics
      await updateUserStats(activityData.userId, processedActivity);
      
      console.log(`Processed activity ${activityId} for user ${activityData.userId}`);
      
    } catch (error) {
      console.error('Error processing activity:', error);
      throw new functions.https.HttpsError('internal', 'Failed to process activity');
    }
  });

// Update session data
async function updateSessionData(activity: ProcessedActivity): Promise<void> {
  const sessionRef = db.collection('sessions').doc(activity.sessionId);
  
  try {
    await db.runTransaction(async (transaction) => {
      const sessionDoc = await transaction.get(sessionRef);
      
      if (!sessionDoc.exists) {
        // Create new session
        const newSession: SessionData = {
          sessionId: activity.sessionId,
          userId: activity.userId,
          projectName: activity.projectName,
          startTime: activity.timestamp,
          totalDuration: 0,
          productiveTime: 0,
          wastedTime: 0,
          activities: [activity],
          productivityScore: 0,
          filesModified: [activity.filePath],
          languages: activity.metadata?.language ? [activity.metadata.language] : []
        };
        
        transaction.set(sessionRef, newSession);
      } else {
        // Update existing session
        const sessionData = sessionDoc.data() as SessionData;
        const updatedActivities = [...sessionData.activities, activity];
        
        // Calculate duration (assuming 1 minute per activity for now)
        const activityDuration = 60 * 1000; // 1 minute in milliseconds
        const newTotalDuration = sessionData.totalDuration + activityDuration;
        const newProductiveTime = sessionData.productiveTime + (activity.isProductive ? activityDuration : 0);
        const newWastedTime = sessionData.wastedTime + (!activity.isProductive ? activityDuration : 0);
        
        // Update files and languages
        const filesModified = [...new Set([...sessionData.filesModified, activity.filePath])];
        const languages = activity.metadata?.language 
          ? [...new Set([...sessionData.languages, activity.metadata.language])]
          : sessionData.languages;
        
        const updatedSession: Partial<SessionData> = {
          endTime: activity.timestamp,
          totalDuration: newTotalDuration,
          productiveTime: newProductiveTime,
          wastedTime: newWastedTime,
          activities: updatedActivities,
          filesModified,
          languages,
          productivityScore: calculateProductivityScore({
            totalDuration: newTotalDuration,
            productiveTime: newProductiveTime
          })
        };
        
        transaction.update(sessionRef, updatedSession);
      }
    });
  } catch (error) {
    console.error('Error updating session data:', error);
    throw error;
  }
}

// Update user statistics
async function updateUserStats(userId: string, activity: ProcessedActivity): Promise<void> {
  const userStatsRef = db.collection('userStats').doc(userId);
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  try {
    await db.runTransaction(async (transaction) => {
      const statsDoc = await transaction.get(userStatsRef);
      
      const activityDuration = 60 * 1000; // 1 minute per activity
      
      if (!statsDoc.exists) {
        // Create new user stats
        const newStats = {
          userId,
          totalHours: activityDuration / (1000 * 60 * 60),
          productiveHours: activity.isProductive ? activityDuration / (1000 * 60 * 60) : 0,
          currentStreak: 1,
          longestStreak: 1,
          totalSessions: 1,
          averageProductivity: activity.isProductive ? 100 : 0,
          dailyStats: {
            [todayKey]: {
              date: todayKey,
              totalTime: activityDuration,
              productiveTime: activity.isProductive ? activityDuration : 0,
              wastedTime: !activity.isProductive ? activityDuration : 0,
              sessions: 1,
              activities: 1
            }
          },
          lastActive: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        
        transaction.set(userStatsRef, newStats);
      } else {
        // Update existing stats
        const statsData = statsDoc.data();
        const dailyStats = statsData?.dailyStats || {};
        const todayStats = dailyStats[todayKey] || {
          date: todayKey,
          totalTime: 0,
          productiveTime: 0,
          wastedTime: 0,
          sessions: 0,
          activities: 0
        };
        
        // Update today's stats
        todayStats.totalTime += activityDuration;
        todayStats.productiveTime += activity.isProductive ? activityDuration : 0;
        todayStats.wastedTime += !activity.isProductive ? activityDuration : 0;
        todayStats.activities += 1;
        
        // Update overall stats
        const newTotalHours = (statsData?.totalHours || 0) + (activityDuration / (1000 * 60 * 60));
        const newProductiveHours = (statsData?.productiveHours || 0) + (activity.isProductive ? activityDuration / (1000 * 60 * 60) : 0);
        
        const updates = {
          totalHours: newTotalHours,
          productiveHours: newProductiveHours,
          averageProductivity: newTotalHours > 0 ? (newProductiveHours / newTotalHours) * 100 : 0,
          [`dailyStats.${todayKey}`]: todayStats,
          lastActive: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        
        transaction.update(userStatsRef, updates);
      }
    });
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
}

// HTTP function for manual data processing (useful for testing)
export const processActivityBatch = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  const { activities } = data;
  
  if (!Array.isArray(activities)) {
    throw new functions.https.HttpsError('invalid-argument', 'Activities must be an array');
  }
  
  try {
    const batch = db.batch();
    const processedActivities: ProcessedActivity[] = [];
    
    for (const activity of activities) {
      const activityRef = db.collection('activities').doc();
      const isProductive = classifyActivity(activity);
      const sessionId = generateSessionId(activity.userId, activity.timestamp);
      
      const processedActivity: ProcessedActivity = {
        ...activity,
        isProductive,
        sessionId,
        timestamp: admin.firestore.Timestamp.fromDate(new Date(activity.timestamp))
      };
      
      batch.set(activityRef, {
        ...processedActivity,
        processed: true,
        processedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      processedActivities.push(processedActivity);
    }
    
    await batch.commit();
    
    return {
      success: true,
      processedCount: processedActivities.length,
      message: `Successfully processed ${processedActivities.length} activities`
    };
    
  } catch (error) {
    console.error('Error processing activity batch:', error);
    throw new functions.https.HttpsError('internal', 'Failed to process activities');
  }
});

// Cleanup old activities (runs daily)
export const cleanupOldActivities = functions.pubsub
  .schedule('0 2 * * *') // Run at 2 AM daily
  .timeZone('UTC')
  .onRun(async (context) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    try {
      const oldActivitiesQuery = db.collection('activities')
        .where('timestamp', '<', admin.firestore.Timestamp.fromDate(thirtyDaysAgo))
        .limit(500);
      
      const snapshot = await oldActivitiesQuery.get();
      
      if (snapshot.empty) {
        console.log('No old activities to clean up');
        return;
      }
      
      const batch = db.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log(`Cleaned up ${snapshot.docs.length} old activities`);
      
    } catch (error) {
      console.error('Error cleaning up old activities:', error);
    }
  });
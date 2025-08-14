import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { ActivityData, SessionData } from '../types/activity';
import { hasFirebaseConfig } from '../config/firebase';

export class ActivityService {
  // Send activity data from VS Code extension
  static async sendActivity(activityData: Omit<ActivityData, 'timestamp'>): Promise<string> {
    if (!hasFirebaseConfig || !db) {
      throw new Error('Firebase not configured');
    }
    
    try {
      const docRef = await addDoc(collection(db, 'activities'), {
        ...activityData,
        timestamp: serverTimestamp(),
        processed: false
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error sending activity:', error);
      throw error;
    }
  }
  
  // Get recent activities for a user
  static async getRecentActivities(userId: string, limitCount: number = 50): Promise<ActivityData[]> {
    if (!hasFirebaseConfig || !db) {
      return [];
    }
    
    try {
      const q = query(
        collection(db, 'activities'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ActivityData[];
    } catch (error) {
      console.error('Error getting recent activities:', error);
      throw error;
    }
  }
  
  // Get sessions for a user
  static async getUserSessions(userId: string, limitCount: number = 20): Promise<SessionData[]> {
    if (!hasFirebaseConfig || !db) {
      return [];
    }
    
    try {
      const q = query(
        collection(db, 'sessions'),
        where('userId', '==', userId),
        orderBy('startTime', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SessionData[];
    } catch (error) {
      console.error('Error getting user sessions:', error);
      throw error;
    }
  }
  
  // Simulate VS Code extension activity (for testing)
  static async simulateActivity(userId: string, projectName: string): Promise<void> {
    if (!hasFirebaseConfig || !db) {
      throw new Error('Firebase not configured');
    }
    
    const activities = [
      {
        userId,
        activityType: 'coding' as const,
        projectName,
        filePath: '/src/components/Dashboard.tsx',
        metadata: { language: 'typescript', linesChanged: 15 }
      },
      {
        userId,
        activityType: 'debugging' as const,
        projectName,
        filePath: '/src/utils/helpers.ts',
        metadata: { language: 'typescript' }
      },
      {
        userId,
        activityType: 'file_operation' as const,
        projectName,
        filePath: '/package.json',
        metadata: { language: 'json' }
      }
    ];
    
    for (const activity of activities) {
      await this.sendActivity(activity);
      // Add small delay between activities
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}
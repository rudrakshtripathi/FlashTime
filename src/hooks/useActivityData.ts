import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ActivityData, SessionData, UserStats } from '../types/activity';

export const useActivityData = (userId: string | null) => {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setActivities([]);
      setSessions([]);
      setUserStats(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Listen to recent activities
    const activitiesQuery = query(
      collection(db, 'activities'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribeActivities = onSnapshot(activitiesQuery, (snapshot) => {
      const activitiesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp as Timestamp
      })) as ActivityData[];
      setActivities(activitiesData);
    });

    // Listen to recent sessions
    const sessionsQuery = query(
      collection(db, 'sessions'),
      where('userId', '==', userId),
      orderBy('startTime', 'desc'),
      limit(20)
    );

    const unsubscribeSessions = onSnapshot(sessionsQuery, (snapshot) => {
      const sessionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startTime: doc.data().startTime as Timestamp,
        endTime: doc.data().endTime as Timestamp
      })) as SessionData[];
      setSessions(sessionsData);
    });

    // Listen to user stats
    const userStatsQuery = query(
      collection(db, 'userStats'),
      where('userId', '==', userId),
      limit(1)
    );

    const unsubscribeUserStats = onSnapshot(userStatsQuery, (snapshot) => {
      if (!snapshot.empty) {
        const statsData = snapshot.docs[0].data() as UserStats;
        setUserStats(statsData);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeActivities();
      unsubscribeSessions();
      unsubscribeUserStats();
    };
  }, [userId]);

  return {
    activities,
    sessions,
    userStats,
    loading
  };
};
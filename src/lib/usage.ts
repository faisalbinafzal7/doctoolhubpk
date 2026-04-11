import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment, setDoc } from 'firebase/firestore';

export const trackToolUsage = async (userId: string, toolId: string, metadata: any = {}) => {
  try {
    // 1. Track user-specific history
    const historyRef = collection(db, 'users', userId, 'history');
    await addDoc(historyRef, {
      toolId,
      timestamp: serverTimestamp(),
      metadata
    });

    // 2. Increment global tool usage count
    const toolStatsRef = doc(db, 'toolStats', toolId);
    await setDoc(toolStatsRef, {
      usageCount: increment(1),
      lastUsed: serverTimestamp()
    }, { merge: true });
    
  } catch (error) {
    console.error('Error tracking tool usage:', error);
  }
};

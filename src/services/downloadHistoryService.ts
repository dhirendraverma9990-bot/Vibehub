import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { DownloadHistoryItem } from '../types';

const COLLECTION_NAME = 'downloads';

export const subscribeToHistory = (
  onData: (items: DownloadHistoryItem[]) => void,
  onError?: (err: any) => void
) => {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy('downloadedAt', 'desc'),
    limit(50)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items: DownloadHistoryItem[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        items.push({
          id: docSnap.id,
          title: d.title || 'Untitled',
          thumbnail: d.thumbnail || '',
          platform: d.platform || 'generic',
          formatType: d.formatType || 'video',
          quality: d.quality || '720p',
          ext: d.formatType === 'audio' ? 'mp3' : 'mp4',
          date: new Date(d.downloadedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          fileSize: d.fileSize || '~12.5 MB',
          originalUrl: d.url || '',
        });
      });
      onData(items);
    },
    (error) => {
      console.warn('Firestore subscription status:', error.message);
      // Attempt to load from localStorage cache if Firestore backend is offline
      try {
        const cached = localStorage.getItem('omnistream_history_cache');
        if (cached) {
          onData(JSON.parse(cached));
        }
      } catch {}

      if (error && (error.code === 'permission-denied' || error.message?.includes('insufficient permissions'))) {
        handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
      }
      if (onError) onError(error);
    }
  );
};

export const persistDownloadRecord = async (item: DownloadHistoryItem): Promise<void> => {
  // Always update local cache for instant offline responsiveness
  try {
    const cached = localStorage.getItem('omnistream_history_cache');
    const list: DownloadHistoryItem[] = cached ? JSON.parse(cached) : [];
    const updated = [item, ...list.filter(i => i.id !== item.id)].slice(0, 50);
    localStorage.setItem('omnistream_history_cache', JSON.stringify(updated));
  } catch {}

  const docRef = doc(db, COLLECTION_NAME, item.id);
  const data = {
    id: item.id,
    url: item.originalUrl || '',
    title: item.title.slice(0, 300),
    thumbnail: item.thumbnail ? item.thumbnail.slice(0, 2048) : '',
    author: 'VibeHub Creator',
    duration: '03:32',
    platform: item.platform,
    formatType: item.formatType,
    quality: item.quality,
    downloadedAt: Date.now(),
    fileSize: item.fileSize || '12.5 MB',
    userId: 'anonymous',
  };

  try {
    await setDoc(docRef, data);
  } catch (error: any) {
    if (error && (error.code === 'permission-denied' || error.message?.includes('insufficient permissions'))) {
      handleFirestoreError(error, OperationType.CREATE, `${COLLECTION_NAME}/${item.id}`);
    } else {
      console.warn('Firestore offline queued write:', error?.message);
    }
  }
};

export const removeDownloadRecord = async (id: string): Promise<void> => {
  try {
    const cached = localStorage.getItem('omnistream_history_cache');
    if (cached) {
      const list: DownloadHistoryItem[] = JSON.parse(cached);
      localStorage.setItem('omnistream_history_cache', JSON.stringify(list.filter(i => i.id !== id)));
    }
  } catch {}

  const docRef = doc(db, COLLECTION_NAME, id);
  try {
    await deleteDoc(docRef);
  } catch (error: any) {
    if (error && (error.code === 'permission-denied' || error.message?.includes('insufficient permissions'))) {
      handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
    } else {
      console.warn('Firestore offline queued delete:', error?.message);
    }
  }
};

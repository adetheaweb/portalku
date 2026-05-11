import { 
  doc, 
  getDoc, 
  setDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PortalSettings } from '../types';

const SETTINGS_DOC_ID = 'branding';

export async function getPortalSettings(): Promise<PortalSettings | null> {
  try {
    const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as PortalSettings;
    }
    return null;
  } catch (error) {
    console.error("Error getting settings:", error);
    return null;
  }
}

export async function updatePortalSettings(settings: Partial<PortalSettings>) {
  try {
    const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
    await setDoc(docRef, settings, { merge: true });
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
}

export function subscribeToSettings(callback: (settings: PortalSettings) => void) {
  const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data() as PortalSettings);
    }
  });
}

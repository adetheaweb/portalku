import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Article } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.log('Firestore Error Details:', JSON.stringify(errInfo, null, 2));
  throw new Error(JSON.stringify(errInfo));
}

export async function createArticle(article: Omit<Article, 'id' | 'createdAt' | 'authorId' | 'authorName'>) {
  if (!auth.currentUser) throw new Error("Must be logged in");
  
  const path = 'articles';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...article,
      authorId: auth.currentUser.uid,
      authorName: auth.currentUser.displayName || 'Anonymous',
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getPublishedArticles() {
  const path = 'articles';
  try {
    const q = query(
      collection(db, path), 
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function getArticleById(id: string) {
  const path = `articles/${id}`;
  try {
    const snapshot = await getDocs(query(collection(db, 'articles'), where('__name__', '==', id)));
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Article;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function updateArticle(id: string, article: Partial<Article>) {
  if (!auth.currentUser) throw new Error("Must be logged in");
  const path = `articles/${id}`;
  try {
    const docRef = doc(db, 'articles', id);
    await updateDoc(docRef, {
      ...article,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteArticle(id: string) {
  if (!auth.currentUser) throw new Error("Must be logged in");
  const path = `articles/${id}`;
  try {
    const docRef = doc(db, 'articles', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function getMyArticles() {
  if (!auth.currentUser) return [];
  const path = 'articles';
  try {
    const q = query(
      collection(db, path), 
      where('authorId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

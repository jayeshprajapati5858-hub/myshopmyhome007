import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, addDoc, getDocs, orderBy, query, Timestamp, doc, 
  updateDoc, where, initializeFirestore, persistentLocalCache, 
  persistentMultipleTabManager, setDoc, getDoc, getDocFromCache, getDocsFromCache, deleteDoc
} from 'firebase/firestore';
import { getAuth, signInAnonymously, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { Order } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyDoG_FkvlV-w4vfwD7yz1CqGBbb4wxphoI",
  authDomain: "mobigear-641d5.firebaseapp.com",
  databaseURL: "https://mobigear-641d5-default-rtdb.firebaseio.com",
  projectId: "mobigear-641d5",
  storageBucket: "mobigear-641d5.firebasestorage.app",
  messagingSenderId: "773717226551",
  appId: "1:773717226551:web:3a499b9137e87def81fbb2",
  measurementId: "G-6TPH3DG3S7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()})
});

export const saveUserProfile = async (userId: string, profileData: any) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, profileData, { merge: true });
    console.log("User profile saved");
  } catch (e) {
    console.error("Error saving user profile: ", e);
    throw e;
  }
};

export const getUserProfile = async (userId: string) => {
  const userRef = doc(db, "users", userId);
  try {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (e: any) {
    console.warn("Firestore server unreachable, trying cache for profile:", e.message);
    try {
      const docSnap = await getDocFromCache(userRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
    } catch (cacheError) {
      console.error("Error getting user profile from cache: ", cacheError);
    }
    return null;
  }
};

export const signIn = async () => {
  try {
    await signInAnonymously(auth);
  } catch (error) {
    console.error("Error signing in anonymously:", error);
  }
};

export const registerUser = async (mobile: string, password: string) => {
  try {
    const email = `${mobile}@mobigear.local`;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (mobile: string, password: string) => {
  try {
    const email = `${mobile}@mobigear.local`;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const saveOrderToFirebase = async (order: Order) => {
  try {
    const user = auth.currentUser;
    const orderData = {
      ...order,
      userId: user ? user.uid : null,
      createdAt: Timestamp.now()
    };
    const docRef = await addDoc(collection(db, "orders"), orderData);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const getOrdersFromFirebase = async (userId?: string): Promise<Order[]> => {
  let q;
  if (userId) {
    q = query(collection(db, "orders"), where("userId", "==", userId));
  } else {
    q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  }
  
  let querySnapshot;
  try {
    querySnapshot = await getDocs(q);
  } catch (e: any) {
    console.warn("Firestore server unreachable, trying cache for orders:", e.message);
    try {
      querySnapshot = await getDocsFromCache(q);
    } catch (cacheError) {
      console.error("Error getting orders from cache: ", cacheError);
      return [];
    }
  }

  const orders: any[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    orders.push({
      ...data,
      firebaseId: doc.id,
      id: data.id
    });
  });

  if (userId || !querySnapshot.metadata.fromCache) {
    orders.sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });
  }

  return orders as Order[];
};

export const saveProductToFirebase = async (product: any) => {
  try {
    const docRef = doc(db, "products", product.id);
    await setDoc(docRef, product);
    return product.id;
  } catch (e) {
    console.error("Error saving product: ", e);
    throw e;
  }
};

export const getProductsFromFirebase = async (): Promise<any[]> => {
  try {
    const q = query(collection(db, "products"));
    const querySnapshot = await getDocs(q);
    const products: any[] = [];
    querySnapshot.forEach((doc) => {
      products.push(doc.data());
    });
    return products;
  } catch (e: any) {
    console.warn("Firestore server unreachable, trying cache for products:", e.message);
    try {
      const q = query(collection(db, "products"));
      const querySnapshot = await getDocsFromCache(q);
      const products: any[] = [];
      querySnapshot.forEach((doc) => {
        products.push(doc.data());
      });
      return products;
    } catch (cacheError) {
      console.error("Error getting products from cache: ", cacheError);
      return [];
    }
  }
};

export const deleteProductFromFirebase = async (productId: string) => {
  try {
    await deleteDoc(doc(db, "products", productId));
    console.log("Product deleted from Firebase");
  } catch (e) {
    console.error("Error deleting product: ", e);
    throw e;
  }
};

export const deleteOrderFromFirebase = async (orderId: string) => {
  try {
    await deleteDoc(doc(db, "orders", orderId));
    console.log("Order deleted from Firebase");
  } catch (e) {
    console.error("Error deleting order: ", e);
    throw e;
  }
};

export const saveCategoryToFirebase = async (category: any) => {
  try {
    const docRef = doc(db, "categories", category.id);
    await setDoc(docRef, category);
    return category.id;
  } catch (e) {
    console.error("Error saving category: ", e);
    throw e;
  }
};

export const getCategoriesFromFirebase = async (): Promise<any[]> => {
  try {
    const q = query(collection(db, "categories"));
    const querySnapshot = await getDocs(q);
    const categories: any[] = [];
    querySnapshot.forEach((doc) => {
      categories.push(doc.data());
    });
    return categories;
  } catch (e: any) {
    console.warn("Firestore server unreachable, trying cache for categories:", e.message);
    try {
      const q = query(collection(db, "categories"));
      const querySnapshot = await getDocsFromCache(q);
      const categories: any[] = [];
      querySnapshot.forEach((doc) => {
        categories.push(doc.data());
      });
      return categories;
    } catch (cacheError) {
      console.error("Error getting categories from cache: ", cacheError);
      return [];
    }
  }
};

export const deleteCategoryFromFirebase = async (categoryId: string) => {
  try {
    await deleteDoc(doc(db, "categories", categoryId));
    console.log("Category deleted from Firebase");
  } catch (e) {
    console.error("Error deleting category: ", e);
    throw e;
  }
};

export const updateOrderInFirebase = async (docId: string, data: any) => {
  try {
    const orderRef = doc(db, "orders", docId);
    await updateDoc(orderRef, data);
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};

export const addReviewToProduct = async (productId: string, review: any) => {
  try {
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);
    if (productSnap.exists()) {
      const productData = productSnap.data();
      const reviewsList = productData.reviewsList || [];
      const updatedReviews = [...reviewsList, review];
      
      // Calculate new average rating
      const totalRating = updatedReviews.reduce((acc, r) => acc + r.rating, 0);
      const newRating = Number((totalRating / updatedReviews.length).toFixed(1));
      
      await updateDoc(productRef, {
        reviewsList: updatedReviews,
        reviews: updatedReviews.length,
        rating: newRating
      });
      return updatedReviews;
    }
  } catch (e) {
    console.error("Error adding review: ", e);
    throw e;
  }
};

export const deleteReviewFromProduct = async (productId: string, reviewId: string) => {
  try {
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);
    if (productSnap.exists()) {
      const productData = productSnap.data();
      const reviewsList = productData.reviewsList || [];
      const updatedReviews = reviewsList.filter((r: any) => r.id !== reviewId);
      
      // Calculate new average rating
      let newRating = 0;
      if (updatedReviews.length > 0) {
        const totalRating = updatedReviews.reduce((acc: number, r: any) => acc + r.rating, 0);
        newRating = Number((totalRating / updatedReviews.length).toFixed(1));
      }
      
      await updateDoc(productRef, {
        reviewsList: updatedReviews,
        reviews: updatedReviews.length,
        rating: newRating
      });
      return updatedReviews;
    }
  } catch (e) {
    console.error("Error deleting review: ", e);
    throw e;
  }
};

export const getStoreSettingsFromFirebase = async () => {
  const settingsRef = doc(db, "settings", "store_config");
  try {
    const snap = await getDoc(settingsRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (e: any) {
    console.warn("Firestore unreachable for settings, trying cache:", e.message);
    try {
      const snap = await getDocFromCache(settingsRef);
      if (snap.exists()) {
        return snap.data();
      }
    } catch {
      // ignore
    }
    return null;
  }
};

export const saveStoreSettingsToFirebase = async (settings: any) => {
  try {
    const settingsRef = doc(db, "settings", "store_config");
    const payload = {
      ...settings,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(settingsRef, payload, { merge: true });
    return payload;
  } catch (e) {
    console.error("Error saving store settings:", e);
    throw e;
  }
};

export const getBuyingGuidesFromFirebase = async (): Promise<any[]> => {
  try {
    const q = query(collection(db, "guides"));
    const querySnapshot = await getDocs(q);
    const guides: any[] = [];
    querySnapshot.forEach((docSnap) => {
      guides.push(docSnap.data());
    });
    return guides;
  } catch (e: any) {
    console.warn("Firestore unreachable for guides, trying cache:", e.message);
    try {
      const q = query(collection(db, "guides"));
      const querySnapshot = await getDocsFromCache(q);
      const guides: any[] = [];
      querySnapshot.forEach((docSnap) => {
        guides.push(docSnap.data());
      });
      return guides;
    } catch {
      return [];
    }
  }
};

export const saveBuyingGuideToFirebase = async (guide: any) => {
  try {
    const docRef = doc(db, "guides", guide.id);
    await setDoc(docRef, guide, { merge: true });
    return guide.id;
  } catch (e) {
    console.error("Error saving buying guide:", e);
    throw e;
  }
};


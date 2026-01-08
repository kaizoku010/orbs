import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    onSnapshot
} from "firebase/firestore";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword as firebaseSignIn, 
    onAuthStateChanged 
} from "firebase/auth";
import { db, auth } from "~/lib/firebase";
import { type User } from "~/mocks/data/users";
import { type Request } from "~/mocks/data/requests";

// ============ AUTHENTICATION SERVICES ============

export async function signUpWithEmailAndPassword(email, password) {
    try {
        return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
        const errorCode = error.code;
        const errorMap: Record<string, string> = {
            'auth/email-already-in-use': 'An account with this email already exists',
            'auth/invalid-email': 'Invalid email address',
            'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
            'auth/operation-not-allowed': 'Sign up is currently disabled',
        };
        
        const message = errorMap[errorCode] || error.message || 'Sign up failed. Please try again.';
        throw new Error(message);
    }
}

export async function signInWithEmailAndPassword(email, password) {
    try {
        return await firebaseSignIn(auth, email, password);
    } catch (error: any) {
        // Map Firebase auth errors to user-friendly messages
        const errorCode = error.code;
        const errorMap: Record<string, string> = {
            'auth/invalid-email': 'Invalid email address',
            'auth/user-disabled': 'This account has been disabled',
            'auth/user-not-found': 'No account found with this email',
            'auth/wrong-password': 'Incorrect password',
            'auth/invalid-credential': 'Invalid email or password',
            'auth/too-many-requests': 'Too many failed login attempts. Please try again later.',
        };
        
        const message = errorMap[errorCode] || error.message || 'Login failed. Please check your credentials.';
        throw new Error(message);
    }
}

export function onAuthStateChangedWrapper(callback) {
    return onAuthStateChanged(auth, callback);
}


// ============ USER SERVICES ============

export async function saveUserToFirestore(user: User) {
    const userRef = doc(db, "users", user.id);
    await setDoc(userRef, user, { merge: true });
    return user;
}

export async function getUserFromFirestore(userId: string): Promise<User | null> {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        return userSnap.data() as User;
    }
    return null;
}

export async function getAllUsersFromFirestore(): Promise<User[]> {
    const usersCol = collection(db, "users");
    const userSnapshot = await getDocs(usersCol);
    return userSnapshot.docs.map(doc => doc.data() as User);
}

// ============ REQUEST SERVICES ============

export async function saveRequestToFirestore(request: Request) {
    const requestRef = doc(db, "requests", request.id);
    await setDoc(requestRef, request);
    return request;
}

export async function getActiveRequestsFromFirestore(): Promise<Request[]> {
    const requestsCol = collection(db, "requests");
    const q = query(
        requestsCol,
        where("status", "in", ["open", "connected", "in-progress", "active"]),
        orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Request);
}

export function subscribeToRequests(callback: (requests: Request[]) => void) {
    const requestsCol = collection(db, "requests");
    const q = query(
        requestsCol,
        where("status", "in", ["open", "connected", "in-progress", "active"])
    );

    return onSnapshot(q, (snapshot) => {
        const requests = snapshot.docs.map(doc => doc.data() as Request);
        // Sort client-side if needed since multi-where orderBy might need index
        callback(requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    });
}

export function subscribeToUsers(callback: (users: User[]) => void) {
    const usersCol = collection(db, "users");
    return onSnapshot(usersCol, (snapshot) => {
        const users = snapshot.docs.map(doc => doc.data() as User);
        callback(users);
    });
}


// ============ BADGE & ACTIVITY SERVICES (Placeholder) ============
// These would be more complex in a real app, involving aggregations or cloud functions

export async function getUserBadges(userId: string) {
    // In a real app, this might be a subcollection
    const user = await getUserFromFirestore(userId);
    return user?.badges || [];
}

export async function getRecentActivity() {
    // This is a simplified version. A real implementation might use a dedicated 'activity' collection.
    const requests = await getActiveRequestsFromFirestore();
    return requests.slice(0, 5); // Return the 5 most recent requests as activity
}

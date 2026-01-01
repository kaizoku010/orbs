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
import { db } from "~/lib/firebase";
import { type User } from "~/mocks/data/users";
import { type Request } from "~/mocks/data/requests";

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

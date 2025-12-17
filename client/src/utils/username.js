import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function isUsernameAvailable(username) {
  const ref = doc(db, "usernames", username.toLowerCase());
  const snap = await getDoc(ref);
  return !snap.exists();
}

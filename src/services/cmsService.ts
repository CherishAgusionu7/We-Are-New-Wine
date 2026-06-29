import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";

export async function getHomepage() {
  const docRef = doc(db, "website", "homepage");
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data();
}
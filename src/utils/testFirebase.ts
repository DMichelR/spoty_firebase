// Test Firebase connectivity - silently logs to console
import { db } from "../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export async function testFirebaseConnection() {
  try {
    // Test write
    const testDocRef = doc(db, "test", "connection");
    await setDoc(testDocRef, {
      message: "Firebase is working!",
      timestamp: new Date(),
    });
    console.log("🔥 Firebase connection: OK");

    // Test read
    const docSnap = await getDoc(testDocRef);
    if (docSnap.exists()) {
      console.log("🔥 Firebase read/write: OK");
    }

    return true;
  } catch (error) {
    console.warn(
      "⚠️ Firebase connection test failed (this is OK for now):",
      error
    );
    return false;
  }
}

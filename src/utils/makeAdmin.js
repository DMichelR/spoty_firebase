// Helper function to make a user admin
// Run this in browser console after logging in

export async function makeCurrentUserAdmin() {
  // This needs to be run in browser console while logged in
  const auth = window.firebase?.auth?.();
  const firestore = window.firebase?.firestore?.();

  if (!auth || !firestore) {
    console.error("Firebase not available");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    console.error("No user logged in");
    return;
  }

  try {
    await firestore.collection("users").doc(user.uid).update({
      role: "admin",
    });
    console.log("✅ User is now admin! Refresh the page.");
  } catch (error) {
    console.error("❌ Error making user admin:", error);
  }
}

// Instructions:
// 1. Login to your app
// 2. Open browser console (F12)
// 3. Paste this function and run: makeCurrentUserAdmin()

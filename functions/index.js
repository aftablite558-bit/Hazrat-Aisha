const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Sync role from Realtime Database to Firebase Auth Custom Claims
exports.syncUserRole = functions.database.ref('/users/{uid}/role')
  .onWrite(async (change, context) => {
    const uid = context.params.uid;
    const role = change.after.val();

    try {
      if (role) {
        await admin.auth().setCustomUserClaims(uid, { role: role });
        console.log(`Successfully set role ${role} for user ${uid}`);
      } else {
        // If role is deleted, remove custom claims
        await admin.auth().setCustomUserClaims(uid, { role: null });
        console.log(`Successfully removed role for user ${uid}`);
      }
    } catch (error) {
      console.error(`Error setting custom claims for user ${uid}:`, error);
    }
  });

// HTTP endpoint to manually bootstrap an admin (useful for first-time setup)
// Usage: https://<region>-<project>.cloudfunctions.net/setAdminClaim?email=admin@example.com
exports.setAdminClaim = functions.https.onRequest(async (req, res) => {
  const email = req.query.email;
  if (!email) {
    res.status(400).send("Email parameter is required");
    return;
  }
  
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { role: 'admin' });
    // Also update RTDB
    await admin.database().ref(`users/${user.uid}/role`).set('admin');
    res.send(`Admin role successfully set for ${email}. Please logout and login again.`);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

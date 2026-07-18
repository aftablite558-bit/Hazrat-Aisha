import fs from 'fs';

async function deployRules() {
  console.log("Fetching access token from metadata server...");
  try {
    const tokenUrl = 'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token?scopes=https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/firebase.database';
    const tokenResponse = await fetch(tokenUrl, {
      headers: { 'Metadata-Flavor': 'Google' }
    });
    
    if (!tokenResponse.ok) {
      throw new Error(`Failed to fetch token: ${tokenResponse.statusText}`);
    }
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    console.log("Token retrieved successfully.");

    console.log("Reading database.rules.json...");
    const rulesContent = fs.readFileSync('database.rules.json', 'utf8');

    console.log("Uploading rules to Firebase Realtime Database...");
    const rtdbUrl = "https://hazrat-aisha-academy-cb36a-default-rtdb.asia-southeast1.firebasedatabase.app/.settings/rules.json";
    
    const putResponse = await fetch(rtdbUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: rulesContent
    });

    if (!putResponse.ok) {
      const errorText = await putResponse.text();
      throw new Error(`Failed to upload rules: ${putResponse.status} ${putResponse.statusText} - ${errorText}`);
    }

    const putData = await putResponse.json();
    console.log("Rules uploaded successfully! Result:", putData);

  } catch (error) {
    console.error("Error deploying database rules:", error);
    process.exit(1);
  }
}

deployRules();

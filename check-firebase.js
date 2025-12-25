const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

console.log("🔍 Starting Paranoid Diagnostic Check...");

const envPath = path.resolve(process.cwd(), '.env.local');
let envContent = '';

try {
    envContent = fs.readFileSync(envPath, 'utf8');
    console.log("✅ Loaded .env.local file");
} catch (e) {
    console.error("❌ Failed to read .env.local file:", e.message);
    process.exit(1);
}

const parseEnv = (content) => {
    const env = {};
    content.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx > 0) {
            const key = trimmed.substring(0, eqIdx).trim();
            let val = trimmed.substring(eqIdx + 1).trim();
            // Remove surrounding quotes if present
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                val = val.slice(1, -1);
            }
            env[key] = val;
        }
    });
    return env;
};

const env = parseEnv(envContent);

const projectId = env.FIREBASE_PROJECT_ID;
const clientEmail = env.FIREBASE_CLIENT_EMAIL;
const rawPrivateKey = env.FIREBASE_PRIVATE_KEY;

console.log("\n--- Variable Inspection ---");
console.log(`[FIREBASE_PROJECT_ID] Raw Value: '${projectId}'`);
console.log(`[FIREBASE_PROJECT_ID] Length: ${projectId ? projectId.length : 0}`);
if (projectId && projectId.match(/\s/)) {
    console.error("❌ WARNING: Project ID contains whitespace!");
}

console.log(`[FIREBASE_CLIENT_EMAIL] Raw Value: '${clientEmail}'`);
console.log(`[FIREBASE_PRIVATE_KEY] Exists: ${!!rawPrivateKey}`);

if (!projectId || !clientEmail || !rawPrivateKey) {
    console.error("❌ Missing one or more required variables.");
    process.exit(1);
}

// Prepare Key
const processedKey = rawPrivateKey.replace(/\\n/g, '\n');

// Init App
try {
    const app = initializeApp({
        credential: cert({
            projectId,
            clientEmail,
            privateKey: processedKey,
        }),
        projectId: projectId
    });
    console.log("✅ Firebase App Initialized");
} catch (e) {
    console.error("❌ Init Failed:", e.message);
    process.exit(1);
}

const db = getFirestore();

// Test Connection
(async () => {
    try {
        console.log("\n--- Testing Firestore Connection ---");
        console.log(`Targeting Project: ${projectId}`);

        console.log("Attempting listCollections()...");
        const collections = await db.listCollections();
        console.log("✅ Success! Collections found:", collections.map(c => c.id));

        console.log("Attempting doc get()...");
        const doc = await db.collection('test').doc('ping').get(); // Should return even if empty
        console.log("✅ Success! Doc fetch worked. Exists:", doc.exists);

        process.exit(0);
    } catch (e) {
        console.error("❌ CONNECTION FAILED");
        console.error("Error Code:", e.code);
        console.error("Error Message:", e.message);

        if (e.code === 5 || e.code === '5') {
            console.error("\nAnalyze Error 5 (NOT_FOUND):");
            console.error("1. Is the Project ID '" + projectId + "' EXACTLY correct?");
            console.error("2. Does the Firestore Database exist in Console?");
            console.error("3. Is the API enabled?");
        }
        process.exit(1);
    }
})();

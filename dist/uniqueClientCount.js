"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Usage:
// Run with: npx ts-node scripts/uniqueClientCount.ts
// If you get import errors with ESM, enable allowImportingTsExtensions in tsconfig.json or use compiled JS with .js extension.
// Or compile with tsc and run with: node dist/scripts/uniqueClientCount.js
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
const url_1 = require("url");
// Get __dirname equivalent for ES modules
const __filename = (0, url_1.fileURLToPath)(import.meta.url);
const __dirname = path.dirname(__filename);
// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });
// Import Firebase directly
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
// Firebase config using environment variables
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
// Initialize Firebase
const app = (0, app_1.initializeApp)(firebaseConfig);
const firestore = (0, firestore_1.getFirestore)(app);
async function generateUniqueClientReport() {
    try {
        console.log('Generating unique client count report from 01/01/2024 to 07/02/2025...');
        // Define date range
        const startDate = new Date('2024-01-01');
        const endDate = new Date('2025-07-02');
        endDate.setHours(23, 59, 59, 999); // End of day
        // Fetch ALL clients data from Firebase (no date filter initially)
        console.log('Fetching all clients data from Firebase...');
        const clientsRef = (0, firestore_1.collection)(firestore, 'clients');
        const querySnapshot = await (0, firestore_1.getDocs)(clientsRef);
        console.log(`Found ${querySnapshot.size} total clients in database`);
        // Filter clients who have visited within the date range
        const uniqueClients = new Set();
        const clientsWithVisits = new Map();
        // First, get all clients and their visit data
        for (const clientDoc of querySnapshot.docs) {
            const clientData = clientDoc.data();
            const clientId = clientDoc.id;
            // Get visits for this client
            const visitsRef = (0, firestore_1.collection)(firestore, 'visits');
            const visitsQuery = (0, firestore_1.query)(visitsRef, (0, firestore_1.where)('clientId', '==', clientId));
            const visitsSnapshot = await (0, firestore_1.getDocs)(visitsQuery);
            let hasVisitsInRange = false;
            let firstVisitDate = null;
            let lastVisitDate = null;
            let totalVisits = 0;
            visitsSnapshot.forEach((visitDoc) => {
                const visitData = visitDoc.data();
                const visitDate = visitData.createdAt.toDate();
                totalVisits++;
                // Check if visit is within our date range
                if (visitDate >= startDate && visitDate <= endDate) {
                    hasVisitsInRange = true;
                    if (!firstVisitDate || visitDate < firstVisitDate) {
                        firstVisitDate = visitDate;
                    }
                    if (!lastVisitDate || visitDate > lastVisitDate) {
                        lastVisitDate = visitDate;
                    }
                }
            });
            // If client has visits in range, add to unique count
            if (hasVisitsInRange && firstVisitDate && lastVisitDate) {
                uniqueClients.add(clientId);
                clientsWithVisits.set(clientId, {
                    clientId,
                    firstName: clientData.firstName || '',
                    lastName: clientData.lastName || '',
                    firstVisitDate,
                    lastVisitDate,
                    totalVisits
                });
            }
        }
        // Convert to CSV format
        const csvHeaders = ['Client ID', 'First Name', 'Last Name', 'First Visit Date', 'Last Visit Date', 'Total Visits'];
        const csvRows = [csvHeaders.join(',')];
        // Sort by last visit date (most recent first)
        const sortedClients = Array.from(clientsWithVisits.values())
            .sort((a, b) => b.lastVisitDate.getTime() - a.lastVisitDate.getTime());
        sortedClients.forEach(client => {
            csvRows.push([
                client.clientId,
                client.firstName,
                client.lastName,
                client.firstVisitDate.toISOString().split('T')[0],
                client.lastVisitDate.toISOString().split('T')[0],
                client.totalVisits
            ].join(','));
        });
        // Add summary row
        csvRows.push(`TOTAL UNIQUE CLIENTS,${uniqueClients.size},,,,`);
        // Write CSV file
        const csvContent = csvRows.join('\n');
        const outputPath = path.join(__dirname, 'unique_client_count.csv');
        fs.writeFileSync(outputPath, csvContent, 'utf8');
        console.log(`\n=== UNIQUE CLIENT REPORT GENERATED ===`);
        console.log(`Report period: 01/01/2024 to 07/02/2025`);
        console.log(`Total unique clients with visits in range: ${uniqueClients.size}`);
        console.log(`Output saved to: ${outputPath}`);
        // Display summary statistics
        console.log(`\nSummary Statistics:`);
        console.log(`- Total clients in database: ${querySnapshot.size}`);
        console.log(`- Unique clients with visits in date range: ${uniqueClients.size}`);
        console.log(`- Percentage of database clients active in range: ${((uniqueClients.size / querySnapshot.size) * 100).toFixed(1)}%`);
        // Calculate average visits per client
        const totalVisits = sortedClients.reduce((sum, client) => sum + client.totalVisits, 0);
        const avgVisits = totalVisits / uniqueClients.size;
        console.log(`- Average visits per unique client: ${avgVisits.toFixed(1)}`);
    }
    catch (error) {
        console.error('Error generating unique client report:', error);
        console.error('Make sure Firebase is properly configured and you have the necessary permissions.');
        process.exit(1);
    }
}
// Run the script
generateUniqueClientReport();

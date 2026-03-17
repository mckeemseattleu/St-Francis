// Make this file a module
export {};

// Usage:
// Run with: npx ts-node scripts/monthlyVisitReport.ts
// If you get import errors with ESM, enable allowImportingTsExtensions in tsconfig.json or use compiled JS with .js extension.
// Or compile with tsc and run with: node dist/scripts/monthlyVisitReport.js

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Import Firebase directly
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

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
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

async function generateMonthlyClientReport() {
  try {
    console.log('Generating monthly client count report from 01/01/2024 to 05/28/2025...');
    
    // Define date range
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2025-05-28');
    endDate.setHours(23, 59, 59, 999); // End of day
    
    // Fetch clients data from Firebase
    console.log('Fetching clients data from Firebase...');
    const clientsRef = collection(firestore, 'clients');
    const q = query(
      clientsRef,
      where('createdAt', '>=', startDate),
      where('createdAt', '<=', endDate)
    );
    
    const querySnapshot = await getDocs(q);
    console.log(`Found ${querySnapshot.size} clients in the date range`);
    
    // Group clients by month
    const monthlyCount: { [monthKey: string]: number } = {};
    
    querySnapshot.forEach((doc) => {
      const client = doc.data();
      const clientDate = client.createdAt.toDate();
      const monthKey = `${clientDate.getFullYear()}-${String(clientDate.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyCount[monthKey]) {
        monthlyCount[monthKey] = 0;
      }
      monthlyCount[monthKey]++;
    });
    
    // Convert to CSV format
    const csvHeaders = ['Month', 'Client Count'];
    const csvRows = [csvHeaders.join(',')];
    
    // Sort months chronologically
    const sortedMonths = Object.keys(monthlyCount).sort();
    
    let totalClients = 0;
    sortedMonths.forEach(month => {
      const count = monthlyCount[month];
      totalClients += count;
      csvRows.push(`${month},${count}`);
    });
    
    // Add total row
    csvRows.push(`TOTAL,${totalClients}`);
    
    // Write CSV file
    const csvContent = csvRows.join('\n');
    const outputPath = path.join(__dirname, 'monthly_client_count.csv');
    
    fs.writeFileSync(outputPath, csvContent, 'utf8');
    
    console.log(`Report generated successfully!`);
    console.log(`Output saved to: ${outputPath}`);
    console.log(`Total months processed: ${sortedMonths.length}`);
    console.log(`Total clients: ${totalClients}`);
    
    // Display summary
    console.log('\nMonthly Client Count Summary:');
    sortedMonths.forEach(month => {
      console.log(`${month}: ${monthlyCount[month]} clients`);
    });
    
  } catch (error) {
    console.error('Error generating report:', error);
    console.error('Make sure Firebase is properly configured and you have the necessary permissions.');
    process.exit(1);
  }
}

// Run the script
generateMonthlyClientReport(); 
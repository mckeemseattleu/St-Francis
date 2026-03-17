import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Import Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, getDocs, collectionGroup, where, Timestamp } from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function generateReport() {
  try {
    console.log('Fetching data from Firestore...');

    // 1. Fetch all clients for demographics
    const clientsSnapshot = await getDocs(collection(db, 'clients'));
    const clients = clientsSnapshot.docs.map(doc => doc.data());
    console.log(`Fetched ${clients.length} clients.`);

    const raceCounts: { [key: string]: number } = {};
    clients.forEach(client => {
      const race = client.race || 'Not Specified';
      raceCounts[race] = (raceCounts[race] || 0) + 1;
    });

    // 2. Fetch all visits for diaper averages
    // Using collectionGroup to get all 'visits' subcollections
    const visitsSnapshot = await getDocs(collectionGroup(db, 'visits'));
    const visits = visitsSnapshot.docs.map(doc => doc.data());
    console.log(`Fetched ${visits.length} visits.`);

    const monthlyDiapers: { [key: string]: { total: number, count: number } } = {};
    visits.forEach(visit => {
      if (visit.createdAt && visit.diaper !== undefined && visit.diaper !== null) {
        const date = (visit.createdAt as Timestamp).toDate();
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyDiapers[monthKey]) {
          monthlyDiapers[monthKey] = { total: 0, count: 0 };
        }
        monthlyDiapers[monthKey].total += visit.diaper;
        monthlyDiapers[monthKey].count += 1;
      }
    });

    const sortedMonths = Object.keys(monthlyDiapers).sort();

    // 3. Generate PDF
    const doc = new jsPDF() as any;
    
    doc.setFontSize(20);
    doc.text('St. Francis Client & Diaper Report', 105, 15, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text('Client Racial/Ethnic Background', 14, 30);
    
    const raceData = Object.entries(raceCounts).map(([race, count]) => [race, count]);
    doc.autoTable({
      startY: 35,
      head: [['Race/Ethnicity', 'Count']],
      body: raceData,
    });

    const nextY = (doc as any).lastAutoTable.finalY + 15;
    doc.text('Monthly Average Diaper Distribution', 14, nextY);

    const diaperData = sortedMonths.map(month => {
      const { total, count } = monthlyDiapers[month];
      const avg = count > 0 ? (total / count).toFixed(2) : '0.00';
      return [month, total, count, avg];
    });

    doc.autoTable({
      startY: nextY + 5,
      head: [['Month', 'Total Diapers', 'Number of Visits', 'Average per Visit']],
      body: diaperData,
    });

    const outputPath = path.join(__dirname, '..', 'documents', 'Client_and_Diaper_Report.pdf');
    const pdfOutput = doc.output('arraybuffer');
    fs.writeFileSync(outputPath, Buffer.from(pdfOutput));

    console.log(`Report generated successfully at: ${outputPath}`);

  } catch (error) {
    console.error('Error generating report:', error);
  }
}

generateReport();

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { jsPDF } = require('jspdf');
const { autoTable } = require('jspdf-autotable');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Import Firebase
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, getDocs, collectionGroup, where, Timestamp } = require('firebase/firestore');

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

    const raceCounts = {};
    const raceMapping = {
      'White': 'White',
      'white': 'White',
      'Whit': 'White',
      'Whitee': 'White',
      'Whitein': 'White',
      'White98107': 'White',
      'White98104': 'White',
      'Black or African American': 'Black or African American',
      'Black': 'Black or African American',
      'African American': 'Black or African American',
      'Black or African Americans': 'Black or African American',
      'Black or African American/white': 'Other',
      'Bl': 'Black or African American',
      'Black or African American98005': 'Black or African American',
      'Hispanic or Latino': 'Hispanic or Latino',
      'Hispanic': 'Hispanic or Latino',
      'Latino': 'Hispanic or Latino',
      'Hispanice': 'Hispanic or Latino',
      'Asian': 'Asian',
      'Asian98104': 'Asian',
      'American Indian or Alaska Native': 'American Indian or Alaska Native',
      'Native Hawaiian or Other Pacific Islander': 'Native Hawaiian or Other Pacific Islander',
      'mixed': 'Other',
      'Other': 'Other',
    };

    clients.forEach(client => {
      let race = client.race || 'Not Specified';
      // Consolidate groups
      const mappedRace = raceMapping[race] || race;
      raceCounts[mappedRace] = (raceCounts[mappedRace] || 0) + 1;
    });

    // 2. Fetch all visits for diaper averages
    // Filter from 01/01/2025 to today
    const startDate = new Date('2025-01-01');
    const visitsSnapshot = await getDocs(query(
      collectionGroup(db, 'visits'),
      where('createdAt', '>=', Timestamp.fromDate(startDate))
    ));
    const visits = visitsSnapshot.docs.map(doc => doc.data());
    console.log(`Fetched ${visits.length} visits since 01/01/2025.`);

    const monthlyDiapers = {};
    visits.forEach(visit => {
      if (visit.createdAt && visit.diaper !== undefined && visit.diaper !== null) {
        const date = visit.createdAt.toDate();
        const year = date.getFullYear();
        const monthKey = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        // Skip invalid future dates (e.g., year > current year + 1)
        const currentYear = new Date().getFullYear();
        if (year > currentYear + 1) {
          console.log(`Skipping invalid visit date: ${monthKey}`);
          return;
        }
        
        if (!monthlyDiapers[monthKey]) {
          monthlyDiapers[monthKey] = { total: 0, count: 0 };
        }
        monthlyDiapers[monthKey].total += visit.diaper;
        monthlyDiapers[monthKey].count += 1;
      }
    });

    const sortedMonths = Object.keys(monthlyDiapers).sort();

    // 3. Generate PDF
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.setTextColor(40);
    doc.text('St. Francis Grant Application Data Report', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 28, { align: 'center' });

    // Section 1: Demographics
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('1. Clientele Racial & Ethnic Background', 14, 45);
    
    doc.setFontSize(10);
    doc.text('This table shows the self-identified racial and ethnic background of our total client base.', 14, 52);
    
    const raceData = Object.entries(raceCounts)
      .filter(([race]) => race !== 'Black or African American98005')
      .map(([race, count]) => [race, count]);
    autoTable(doc, {
      startY: 55,
      head: [['Race/Ethnicity Group', 'Total Client Count']],
      body: raceData,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
    });

    // Section 2: Diaper Distribution
    const nextY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(16);
    doc.text('2. Monthly Diaper Distribution Analysis', 14, nextY);

    doc.setFontSize(10);
    doc.text('Data reflects distributions from 01/01/2025 to present.', 14, nextY + 7);
    doc.text('* "Average Diapers per Visit" represents the mean number of diapers provided to a family during a single visit.', 14, nextY + 12);

    const diaperData = sortedMonths.map(month => {
      const { total, count } = monthlyDiapers[month];
      const avg = count > 0 ? (total / count).toFixed(2) : '0.00';
      return [month, total.toLocaleString(), count.toLocaleString(), avg];
    });

    autoTable(doc, {
      startY: nextY + 17,
      head: [['Reporting Month', 'Total Diapers Distributed', 'Number of Family Visits', 'Average Diapers per Visit']],
      body: diaperData,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
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

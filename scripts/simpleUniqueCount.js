// Simple unique client count that doesn't require complex indexes
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, getDocs, limit } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

async function getSimpleUniqueCount() {
  try {
    console.log('=== SIMPLE UNIQUE CLIENT COUNT ===');
    console.log('Counting unique clients without complex indexes...');
    
    // Strategy: Get all clients and check their last visit date
    console.log('\n1. Getting all clients...');
    const clientsRef = collection(firestore, 'clients');
    const clientsQuery = query(clientsRef, limit(1000)); // Start with first 1000
    
    const clientsSnapshot = await getDocs(clientsQuery);
    console.log(`Found ${clientsSnapshot.size} clients (first 1000)`);
    
    const clientsWithRecentVisits = [];
    let processedCount = 0;
    
    console.log('\n2. Checking last visit dates for each client...');
    
    for (const clientDoc of clientsSnapshot.docs) {
      processedCount++;
      if (processedCount % 100 === 0) {
        console.log(`Processed ${processedCount} clients...`);
      }
      
      const clientId = clientDoc.id;
      const clientData = clientDoc.data();
      
      // Get the last visit for this client
      const visitsRef = collection(firestore, 'clients', clientId, 'visits');
      const visitsQuery = query(visitsRef, limit(1)); // Just get the most recent
      
      try {
        const visitsSnapshot = await getDocs(visitsQuery);
        
        if (!visitsSnapshot.empty) {
          const lastVisit = visitsSnapshot.docs[0].data();
          const visitDate = lastVisit.createdAt.toDate();
          
          // Check if visit is within our target period
          const startDate = new Date('2024-01-01');
          const endDate = new Date('2025-07-02');
          
          if (visitDate >= startDate && visitDate <= endDate) {
            clientsWithRecentVisits.push({
              clientId,
              firstName: clientData.firstName || '',
              lastName: clientData.lastName || '',
              lastVisitDate: visitDate,
              visitCount: visitsSnapshot.size // This will be 1 since we limited to 1
            });
          }
        }
      } catch (error) {
        // Skip clients with no visits or errors
        continue;
      }
    }
    
    console.log(`\n3. Results:`);
    console.log(`Clients processed: ${processedCount}`);
    console.log(`Clients with visits in period: ${clientsWithRecentVisits.length}`);
    
    // Sort by last visit date
    clientsWithRecentVisits.sort((a, b) => b.lastVisitDate - a.lastVisitDate);
    
    // Show recent clients
    console.log('\n4. Most recent clients:');
    clientsWithRecentVisits.slice(0, 10).forEach((client, index) => {
      console.log(`${index + 1}. ${client.firstName} ${client.lastName} - ${client.lastVisitDate.toISOString().split('T')[0]}`);
    });
    
    // Calculate estimate for full database
    const samplePercentage = (processedCount / 60937) * 100; // Using the 60,937 total we saw earlier
    const estimatedTotal = Math.round((clientsWithRecentVisits.length / processedCount) * 60937);
    
    console.log('\n=== ESTIMATE FOR FULL DATABASE ===');
    console.log(`Sample size: ${processedCount} clients (${samplePercentage.toFixed(1)}% of total)`);
    console.log(`Clients with visits in period: ${clientsWithRecentVisits.length}`);
    console.log(`Estimated total unique clients: ~${estimatedTotal.toLocaleString()}`);
    
    // Save results
    const fs = require('fs');
    const results = {
      period: '2024-01-01 to 2025-07-02',
      sampleSize: processedCount,
      samplePercentage: samplePercentage,
      clientsWithVisits: clientsWithRecentVisits.length,
      estimatedTotal: estimatedTotal,
      recentClients: clientsWithRecentVisits.slice(0, 50) // Save first 50 for reference
    };
    
    fs.writeFileSync(
      path.join(__dirname, 'simple_unique_count.json'), 
      JSON.stringify(results, null, 2)
    );
    
    console.log('\nResults saved to: scripts/simple_unique_count.json');
    
  } catch (error) {
    console.error('Error getting simple unique count:', error);
  }
}

getSimpleUniqueCount(); 
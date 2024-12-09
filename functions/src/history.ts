import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseConfig } from '../../config';

async function setupHistory() {
  const app = initializeApp(firebaseConfig); // Initialize Firebase
  const db = getFirestore(app); // Get Firestore instance
  const historyCollection = collection(db, 'model_interactions'); // Reference the collection

  const historyContainer = document.createElement('div'); // Create container for history
  historyContainer.id = 'historyContainer';
  historyContainer.style.marginTop = '20px';
  historyContainer.style.padding = '10px';
  historyContainer.style.border = '1px solid #ddd';
  historyContainer.style.borderRadius = '8px';
  historyContainer.style.backgroundColor = '#f9f9f9';
  historyContainer.innerHTML = '<h2>Interaction History:</h2>';

  try {
    const querySnapshot = await getDocs(historyCollection); // Fetch all documents
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const request = data.request || 'No Request';
      const response = data.response || 'No Response';

      const historyItem = document.createElement('div');
      historyItem.style.marginBottom = '10px';
      historyItem.innerHTML = `
        <p><strong>Request:</strong> ${request}</p>
        <p><strong>Response:</strong> ${response}</p>
        <hr />
      `;
      historyContainer.appendChild(historyItem); // Append history item
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    const errorMsg = document.createElement('p');
    errorMsg.textContent = 'Failed to load history.';
    historyContainer.appendChild(errorMsg);
  }

  // Append the history container to the UI
  const container = document.querySelector('.container');
  if (container) {
    container.appendChild(historyContainer);
  }
}

export default setupHistory;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
const config_1 = require("../../config");
function setupHistory() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, app_1.initializeApp)(config_1.firebaseConfig); // Initialize Firebase
        const db = (0, firestore_1.getFirestore)(app); // Get Firestore instance
        const historyCollection = (0, firestore_1.collection)(db, 'model_interactions'); // Reference the collection
        const historyContainer = document.createElement('div'); // Create container for history
        historyContainer.id = 'historyContainer';
        historyContainer.style.marginTop = '20px';
        historyContainer.style.padding = '10px';
        historyContainer.style.border = '1px solid #ddd';
        historyContainer.style.borderRadius = '8px';
        historyContainer.style.backgroundColor = '#f9f9f9';
        historyContainer.innerHTML = '<h2>Interaction History:</h2>';
        try {
            const querySnapshot = yield (0, firestore_1.getDocs)(historyCollection); // Fetch all documents
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
        }
        catch (error) {
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
    });
}
exports.default = setupHistory;

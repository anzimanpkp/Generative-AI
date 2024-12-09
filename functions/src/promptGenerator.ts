import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../config';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getVertexAI, getGenerativeModel } from 'firebase/vertexai-preview';
import { generateResponse, updateResponse, removeHistory } from './utils';

async function setupPromptGenerator() {
  removeHistory()
  // console.log("############");
  const app = initializeApp(firebaseConfig);
  const vertexAI = getVertexAI(app);
  const model = getGenerativeModel(vertexAI, { model: 'gemini-1.5-flash-preview-0514' });
  const db = getFirestore(app); // Initialize Firestore

  const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
  const inputField = document.getElementById('inputField') as HTMLTextAreaElement;
  const responseText = document.getElementById('responseText') as HTMLParagraphElement;
  const responseContainer = document.getElementById('response') as HTMLDivElement;
  const loadingIndicator = document.getElementById('loading') as HTMLDivElement;

  // responseContainer.style.display = 'none';
  // loadingIndicator.style.display = 'none';

  submitBtn.addEventListener('click', async () => {
    const userInput = inputField.value.trim();

    if (!userInput) {
      updateResponse(responseText, 'Please enter a valid prompt.', loadingIndicator, responseContainer);
      return;
    }

    try {
      loadingIndicator.style.display = 'block';

      const generatedResponse = await generateResponse(model, userInput, responseText, loadingIndicator, responseContainer);

      const docRef = await addDoc(collection(db, 'model_interactions'), {
        request: userInput,
        response: generatedResponse,
      });

      console.log('Document written with ID:', docRef.id);
    } catch (error) {
      console.error('Error saving to Firestore:', error);
    } finally {
      loadingIndicator.style.display = 'none';
    }
  });
}

export default setupPromptGenerator;

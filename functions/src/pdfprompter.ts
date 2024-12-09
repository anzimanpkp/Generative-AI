import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../config';
import { getVertexAI, getGenerativeModel } from 'firebase/vertexai-preview';
import * as pdfjsLib from 'pdfjs-dist';
import { generateResponse, updateResponse, removeHistory } from './utils';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js';

async function setupPdfSummarizer() {
  removeHistory();
  const app = initializeApp(firebaseConfig);
  const vertexAI = getVertexAI(app);
  const model = getGenerativeModel(vertexAI, { model: 'gemini-1.5-flash-preview-0514' });

  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  const uploadBtn = document.getElementById('uploadBtn') as HTMLButtonElement;
  const responseText = document.getElementById('pdfResponseText') as HTMLParagraphElement;
  const responseContainer = document.getElementById('pdfResponse') as HTMLDivElement;
  const loadingIndicator = document.getElementById('pdfLoading') as HTMLDivElement;
  const pdfQuestionField = document.getElementById('pdfQuestionField') as HTMLTextAreaElement;
  const askQuestionBtn = document.getElementById('askQuestionBtn') as HTMLButtonElement;

  // responseContainer.style.display = 'none';
  // loadingIndicator.style.display = 'none';

  uploadBtn.addEventListener('click', async () => {
    const file = fileInput.files?.[0];

    if (!file) {
      updateResponse(responseText, 'Please upload a valid PDF file.', loadingIndicator, responseContainer);
      return;
    }

    try {
      loadingIndicator.style.display = 'block';
      responseContainer.style.display = 'none';

      const pdfText = await extractTextFromPDF(file);
      console.log('Extracted PDF text:', pdfText);

      //await generateResponse(model, `Summarize this: => ${pdfText}`, responseText, loadingIndicator, responseContainer);
      updateResponse(responseText, 'Pdf is uploaded, Enter prompt to continue', loadingIndicator, responseContainer);
    } catch (error) {
      console.error('Error during PDF summarization:', error);
      updateResponse(responseText, 'Error processing the PDF. Please try again.', loadingIndicator, responseContainer);
    }
  });

  askQuestionBtn.addEventListener('click', async () => {
    const question = pdfQuestionField.value.trim();

    if (!question) {
      updateResponse(responseText, 'Please enter a question about the PDF.', loadingIndicator, responseContainer);
      return;
    }

    try {
      const pdfText = await extractTextFromPDF(fileInput.files?.[0] as File);
      console.log('Extracted PDF text:', pdfText);

      await generateResponse(
        model,
        `Answer the question based on this PDF: ${question} => ${pdfText}`,
        responseText,
        loadingIndicator,
        responseContainer
      );
    } catch (error) {
      console.error('Error during question answering:', error);
      updateResponse(responseText, 'Error processing the PDF. Please try again.', loadingIndicator, responseContainer);
    }
  });

  function extractTextFromPDF(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const pdfData = new Uint8Array(e.target?.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument(pdfData).promise;
          let pdfText = '';

          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            pdfText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
          }

          resolve(pdfText);
        } catch (err) {
          reject('Error extracting text from PDF: ' + err);
        }
      };

      reader.onerror = () => {
        reject('Error reading PDF file.');
      };

      reader.readAsArrayBuffer(file);
    });
  }
}

export default setupPdfSummarizer;

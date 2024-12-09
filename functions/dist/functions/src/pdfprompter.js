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
const config_1 = require("../../config");
const vertexai_preview_1 = require("firebase/vertexai-preview");
const pdfjsLib = require("pdfjs-dist");
const utils_1 = require("./utils");
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js';
function setupPdfSummarizer() {
    return __awaiter(this, void 0, void 0, function* () {
        (0, utils_1.removeHistory)();
        const app = (0, app_1.initializeApp)(config_1.firebaseConfig);
        const vertexAI = (0, vertexai_preview_1.getVertexAI)(app);
        const model = (0, vertexai_preview_1.getGenerativeModel)(vertexAI, { model: 'gemini-1.5-flash-preview-0514' });
        const fileInput = document.getElementById('fileInput');
        const uploadBtn = document.getElementById('uploadBtn');
        const responseText = document.getElementById('pdfResponseText');
        const responseContainer = document.getElementById('pdfResponse');
        const loadingIndicator = document.getElementById('pdfLoading');
        const pdfQuestionField = document.getElementById('pdfQuestionField');
        const askQuestionBtn = document.getElementById('askQuestionBtn');
        // responseContainer.style.display = 'none';
        // loadingIndicator.style.display = 'none';
        uploadBtn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const file = (_a = fileInput.files) === null || _a === void 0 ? void 0 : _a[0];
            if (!file) {
                (0, utils_1.updateResponse)(responseText, 'Please upload a valid PDF file.', loadingIndicator, responseContainer);
                return;
            }
            try {
                loadingIndicator.style.display = 'block';
                responseContainer.style.display = 'none';
                const pdfText = yield extractTextFromPDF(file);
                console.log('Extracted PDF text:', pdfText);
                //await generateResponse(model, `Summarize this: => ${pdfText}`, responseText, loadingIndicator, responseContainer);
                (0, utils_1.updateResponse)(responseText, 'Pdf is uploaded, Enter prompt to continue', loadingIndicator, responseContainer);
            }
            catch (error) {
                console.error('Error during PDF summarization:', error);
                (0, utils_1.updateResponse)(responseText, 'Error processing the PDF. Please try again.', loadingIndicator, responseContainer);
            }
        }));
        askQuestionBtn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            var _b;
            const question = pdfQuestionField.value.trim();
            if (!question) {
                (0, utils_1.updateResponse)(responseText, 'Please enter a question about the PDF.', loadingIndicator, responseContainer);
                return;
            }
            try {
                const pdfText = yield extractTextFromPDF((_b = fileInput.files) === null || _b === void 0 ? void 0 : _b[0]);
                console.log('Extracted PDF text:', pdfText);
                yield (0, utils_1.generateResponse)(model, `Answer the question based on this PDF: ${question} => ${pdfText}`, responseText, loadingIndicator, responseContainer);
            }
            catch (error) {
                console.error('Error during question answering:', error);
                (0, utils_1.updateResponse)(responseText, 'Error processing the PDF. Please try again.', loadingIndicator, responseContainer);
            }
        }));
        function extractTextFromPDF(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    try {
                        const pdfData = new Uint8Array((_a = e.target) === null || _a === void 0 ? void 0 : _a.result);
                        const pdf = yield pdfjsLib.getDocument(pdfData).promise;
                        let pdfText = '';
                        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                            const page = yield pdf.getPage(pageNum);
                            const textContent = yield page.getTextContent();
                            pdfText += textContent.items.map((item) => item.str).join(' ') + '\n';
                        }
                        resolve(pdfText);
                    }
                    catch (err) {
                        reject('Error extracting text from PDF: ' + err);
                    }
                });
                reader.onerror = () => {
                    reject('Error reading PDF file.');
                };
                reader.readAsArrayBuffer(file);
            });
        }
    });
}
exports.default = setupPdfSummarizer;

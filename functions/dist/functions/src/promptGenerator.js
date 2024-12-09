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
const firestore_1 = require("firebase/firestore");
const vertexai_preview_1 = require("firebase/vertexai-preview");
const utils_1 = require("./utils");
function setupPromptGenerator() {
    return __awaiter(this, void 0, void 0, function* () {
        (0, utils_1.removeHistory)();
        // console.log("############");
        const app = (0, app_1.initializeApp)(config_1.firebaseConfig);
        const vertexAI = (0, vertexai_preview_1.getVertexAI)(app);
        const model = (0, vertexai_preview_1.getGenerativeModel)(vertexAI, { model: 'gemini-1.5-flash-preview-0514' });
        const db = (0, firestore_1.getFirestore)(app); // Initialize Firestore
        const submitBtn = document.getElementById('submitBtn');
        const inputField = document.getElementById('inputField');
        const responseText = document.getElementById('responseText');
        const responseContainer = document.getElementById('response');
        const loadingIndicator = document.getElementById('loading');
        // responseContainer.style.display = 'none';
        // loadingIndicator.style.display = 'none';
        submitBtn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            const userInput = inputField.value.trim();
            if (!userInput) {
                (0, utils_1.updateResponse)(responseText, 'Please enter a valid prompt.', loadingIndicator, responseContainer);
                return;
            }
            try {
                loadingIndicator.style.display = 'block';
                const generatedResponse = yield (0, utils_1.generateResponse)(model, userInput, responseText, loadingIndicator, responseContainer);
                const docRef = yield (0, firestore_1.addDoc)((0, firestore_1.collection)(db, 'model_interactions'), {
                    request: userInput,
                    response: generatedResponse,
                });
                console.log('Document written with ID:', docRef.id);
            }
            catch (error) {
                console.error('Error saving to Firestore:', error);
            }
            finally {
                loadingIndicator.style.display = 'none';
            }
        }));
    });
}
exports.default = setupPromptGenerator;

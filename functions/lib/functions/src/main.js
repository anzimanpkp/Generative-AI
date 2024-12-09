"use strict";
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
const config_1 = require("../../config"); // This should work after the changes
// import {
//   initializeAppCheck,
//   ReCaptchaEnterpriseProvider,
// } from "firebase/app-check";
const vertexai_preview_1 = require("firebase/vertexai-preview");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, app_1.initializeApp)(config_1.firebaseConfig);
        // Initialize App Check
        // This line can be removed if you do not want to enable App Check for
        // your project. App Check is recommended to limit unauthorized usage.
        // initializeAppCheck(app, {
        //   provider: new ReCaptchaEnterpriseProvider(RECAPTCHA_ENTERPRISE_SITE_KEY),
        // });
        // Get VertexAI instance
        const vertexAI = (0, vertexai_preview_1.getVertexAI)(app);
        // Get a Gemini model
        const model = (0, vertexai_preview_1.getGenerativeModel)(vertexAI, { model: "gemini-1.5-flash-preview-0514" });
        // Get the submit button, input field, response elements, and loading indicator
        const submitBtn = document.getElementById('submitBtn');
        const inputField = document.getElementById('inputField');
        const responseText = document.getElementById('responseText');
        const responseContainer = document.getElementById('response');
        const loadingIndicator = document.getElementById('loading');
        // Hide the response and loading initially
        responseContainer.style.display = 'none';
        loadingIndicator.style.display = 'none';
        // Add event listener for the button
        submitBtn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            const userInput = inputField.value.trim();
            // Validate input
            if (!userInput) {
                responseText.textContent = 'Please enter a valid prompt.';
                return;
            }
            // Show the loading indicator and hide the previous response
            loadingIndicator.style.display = 'block';
            responseContainer.style.display = 'none';
            try {
                // Call generateContent with the user input
                const generateContentResult = yield model.generateContent(userInput);
                // Hide the loading indicator and display the response
                loadingIndicator.style.display = 'none';
                responseContainer.style.display = 'block';
                responseText.textContent = generateContentResult.response.text();
            }
            catch (error) {
                loadingIndicator.style.display = 'none';
                responseContainer.style.display = 'block';
                responseText.textContent = 'Error generating response. Please try again.';
                console.error(error);
            }
        }));
    });
}
main();

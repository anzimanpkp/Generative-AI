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
exports.removeHistory = exports.updateResponse = exports.generateResponse = void 0;
function generateResponse(model, input, responseText, loadingIndicator, responseContainer) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // loadingIndicator.style.display = 'block';
            // responseContainer.style.display = 'none';
            console.log('Sending prompt:', input);
            const generateContentResult = yield model.generateContent(input);
            console.log('Full Response received:', generateContentResult);
            loadingIndicator.style.display = 'none';
            responseContainer.style.display = 'block';
            if (generateContentResult === null || generateContentResult === void 0 ? void 0 : generateContentResult.response) {
                const response = generateContentResult.response;
                const text = typeof response.text === 'function' ? response.text() : response.text || 'No text found in response.';
                const formattedText = formatResponse(text);
                responseText.innerHTML = formattedText;
                return formattedText;
            }
            else {
                responseText.textContent = 'No response generated.';
                return 'No response generated.';
            }
        }
        catch (error) {
            console.error('Error during content generation:', error);
            responseText.textContent = 'Error generating response. Please try again.';
            loadingIndicator.style.display = 'none';
            responseContainer.style.display = 'block';
            return 'Error generating response. Please try again.'; // Return error message
        }
    });
}
exports.generateResponse = generateResponse;
function formatResponse(text) {
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Format unordered lists
    text = text.replace(/^\s*\*\s*(.*?)$/gm, '<ul><li>$1</li></ul>');
    text = text.replace(/<ul><ul>/g, '<ul>');
    text = text.replace(/<\/ul><ul>/g, '</ul>');
    return text;
}
function updateResponse(responseText, message, loadingIndicator, responseContainer) {
    responseText.textContent = message;
    loadingIndicator.style.display = 'none';
    responseContainer.style.display = 'block';
}
exports.updateResponse = updateResponse;
function removeHistory() {
    const existingHistoryContainer = document.getElementById('historyContainer');
    if (existingHistoryContainer) {
        //existingHistoryContainer.classList.add('hidden');
        existingHistoryContainer.innerHTML = '';
        existingHistoryContainer.remove();
    }
}
exports.removeHistory = removeHistory;

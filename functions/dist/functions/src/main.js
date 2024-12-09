"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promptGenerator_1 = require("./promptGenerator");
const pdfprompter_1 = require("./pdfprompter");
const history_1 = require("./history");
const utils_1 = require("./utils");
function main() {
    (0, utils_1.removeHistory)();
    const normalPromptBtn = document.getElementById('normalPromptBtn');
    const pdfSummarizerBtn = document.getElementById('pdfSummarizerBtn');
    const showHistoryBtn = document.getElementById('showHistoryBtn');
    normalPromptBtn.addEventListener('click', promptGenerator_1.default);
    pdfSummarizerBtn.addEventListener('click', pdfprompter_1.default);
    showHistoryBtn.addEventListener('click', history_1.default);
}
main();

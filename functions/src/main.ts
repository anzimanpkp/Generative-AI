import setupPromptGenerator from './promptGenerator';
import setupPdfSummarizer from './pdfprompter';
import setupHistory from './history';
import { removeHistory } from './utils'; 

function main() {
  removeHistory();
  const normalPromptBtn = document.getElementById('normalPromptBtn') as HTMLButtonElement;
  const pdfSummarizerBtn = document.getElementById('pdfSummarizerBtn') as HTMLButtonElement;
  const showHistoryBtn = document.getElementById('showHistoryBtn') as HTMLButtonElement;

  normalPromptBtn.addEventListener('click', setupPromptGenerator);
  pdfSummarizerBtn.addEventListener('click', setupPdfSummarizer);
  showHistoryBtn.addEventListener('click', setupHistory); 
}

main();

export async function generateResponse(
  model: any,
  input: string,
  responseText: HTMLParagraphElement,
  loadingIndicator: HTMLDivElement,
  responseContainer: HTMLDivElement
) {
  try {
    // loadingIndicator.style.display = 'block';
    // responseContainer.style.display = 'none';

    console.log('Sending prompt:', input);
    const generateContentResult = await model.generateContent(input);

    console.log('Full Response received:', generateContentResult);

    loadingIndicator.style.display = 'none';
    responseContainer.style.display = 'block';

    if (generateContentResult?.response) {
      const response = generateContentResult.response;
      const text = 
        typeof response.text === 'function' ? response.text() : response.text || 'No text found in response.';
        
      const formattedText = formatResponse(text);
      responseText.innerHTML = formattedText;
      return formattedText; 
    } else {
      responseText.textContent = 'No response generated.';
      return 'No response generated.'; 
    }
  } catch (error) {
    console.error('Error during content generation:', error);
    responseText.textContent = 'Error generating response. Please try again.';
    loadingIndicator.style.display = 'none';
    responseContainer.style.display = 'block';
    return 'Error generating response. Please try again.'; // Return error message
  }
}


function formatResponse(text: string): string {
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Format unordered lists
  text = text.replace(/^\s*\*\s*(.*?)$/gm, '<ul><li>$1</li></ul>'); 
  text = text.replace(/<ul><ul>/g, '<ul>'); 
  text = text.replace(/<\/ul><ul>/g, '</ul>'); 

  return text;
}

export function updateResponse(
  responseText: HTMLParagraphElement,
  message: string,
  loadingIndicator: HTMLDivElement,
  responseContainer: HTMLDivElement,
) {
  responseText.textContent = message;
  loadingIndicator.style.display = 'none';
  responseContainer.style.display = 'block';
}

export function removeHistory(){
const existingHistoryContainer = document.getElementById('historyContainer');
  if (existingHistoryContainer) {
    //existingHistoryContainer.classList.add('hidden');
     existingHistoryContainer.innerHTML = ''; 
     existingHistoryContainer.remove();
    
  }
  
}

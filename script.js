// Audio controls
const playBtn = document.getElementById('play-audio');
const pauseBtn = document.getElementById('pause-audio');
const themeAudio = document.getElementById('theme-audio');

playBtn.addEventListener('click', () => {
  themeAudio.play();
});

pauseBtn.addEventListener('click', () => {
  themeAudio.pause();
});

// Main elements
const asciiInput = document.getElementById('ascii-input');
const decipherBtn = document.getElementById('decipher-btn');
const returnBtn = document.getElementById('return-btn');
const calculationDetails = document.getElementById('calculation-details');
const finalOutput = document.getElementById('final-output');
const planchette = document.getElementById('planchette');

// Decipher button click handler
decipherBtn.addEventListener('click', async () => {
  const input = asciiInput.value.trim();

  if (!input) {
    showError('Por favor, insira códigos ASCII válidos.');
    return;
  }

  // Parse ASCII codes
  const asciiCodes = input.split(/\s+/).map(code => parseInt(code));

  // Validate codes
  const invalidCodes = asciiCodes.filter(code => isNaN(code) || code < 0 || code > 127);

  if (invalidCodes.length > 0) {
    showError(`Códigos ASCII inválidos detectados. Use valores entre 0 e 127.`);
    return;
  }

  // Clear previous results
  calculationDetails.innerHTML = '';
  finalOutput.innerHTML = '';

  // Show calculation steps
  displayCalculationSteps(asciiCodes);

  // Start planchette animation
  await animatePlanchette(asciiCodes);

  // Display final result
  displayFinalResult(asciiCodes);
});

// Return button click handler
returnBtn.addEventListener('click', () => {
  asciiInput.value = '';
  calculationDetails.innerHTML = '';
  finalOutput.innerHTML = '';
  planchette.style.display = 'none';
  removeAllActiveStates();
});

// Display calculation steps
function displayCalculationSteps(asciiCodes) {
  calculationDetails.innerHTML = '<div class="calculation-step"><strong>🔮 Passo a Passo da Decifração:</strong></div>';

  asciiCodes.forEach((code, index) => {
    const char = String.fromCharCode(code);
    const step = document.createElement('div');
    step.className = 'calculation-step';
    step.style.animationDelay = `${index * 0.1}s`;
    step.innerHTML = `<strong>Código ${index + 1}:</strong> ${code} → <strong>${getCharDisplay(char)}</strong>`;
    calculationDetails.appendChild(step);
  });
}

// Get character display (handling special characters)
function getCharDisplay(char) {
  if (char === ' ') return 'ESPAÇO';
  if (char === '?') return '¿?';
  return char.toUpperCase();
}

// Animate planchette movement
async function animatePlanchette(asciiCodes) {
  planchette.style.display = 'block';

  for (let i = 0; i < asciiCodes.length; i++) {
    const char = String.fromCharCode(asciiCodes[i]).toUpperCase();
    const targetElement = findBoardElement(char);

    if (targetElement) {
      await movePlanchetteTo(targetElement);
      highlightElement(targetElement);
      await sleep(800);
      removeHighlight(targetElement);
    }

    await sleep(300);
  }

  planchette.style.display = 'none';
}

// Find board element by character
function findBoardElement(char) {
  // Handle special cases
  if (char === ' ') {
    return document.querySelector('[data-char=" "]');
  }
  if (char === '?') {
    return document.querySelector('[data-char="¿?"]');
  }

  // Find exact match
  const elements = document.querySelectorAll('.board-item');
  for (let element of elements) {
    if (element.dataset.char === char) {
      return element;
    }
  }

  return null;
}

// Move planchette to target element
function movePlanchetteTo(element) {
  return new Promise(resolve => {
    const rect = element.getBoundingClientRect();
    const boardRect = document.querySelector('.ouija-board').getBoundingClientRect();

    const x = rect.left - boardRect.left + rect.width / 2 - 40;
    const y = rect.top - boardRect.top + rect.height / 2 - 40;

    planchette.style.transition = 'all 1s cubic-bezier(0.4, 0.0, 0.2, 1)';
    planchette.style.left = `${x}px`;
    planchette.style.top = `${y}px`;

    setTimeout(resolve, 1000);
  });
}

// Highlight element
function highlightElement(element) {
  element.classList.add('active');
}

// Remove highlight from element
function removeHighlight(element) {
  element.classList.remove('active');
}

// Remove all active states
function removeAllActiveStates() {
  const activeElements = document.querySelectorAll('.board-item.active');
  activeElements.forEach(el => el.classList.remove('active'));
}

// Display final result with animation
function displayFinalResult(asciiCodes) {
  const decodedChars = asciiCodes.map(code => {
    const char = String.fromCharCode(code);
    return getCharDisplay(char);
  });

  const resultText = decodedChars.join(', ');

  finalOutput.innerHTML = '<strong>✨ Mensagem Decifrada:</strong><br>';

  // Animate each letter appearance
  decodedChars.forEach((char, index) => {
    setTimeout(() => {
      const span = document.createElement('span');
      span.className = 'letter-appear';
      span.textContent = char;
      span.style.animationDelay = '0s';

      if (index < decodedChars.length - 1) {
        span.textContent += ', ';
      }

      finalOutput.appendChild(span);
    }, index * 150);
  });
}

// Show error message
function showError(message) {
  calculationDetails.innerHTML = `
        <div class="calculation-step" style="border-left-color: #ff4444; color: #ff6666;">
            <strong>❌ Erro:</strong> ${message}
        </div>
    `;
  finalOutput.innerHTML = '';
}

// Sleep utility function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize: hide planchette on load
planchette.style.display = 'none';

// Video background controls (optional - garantir que o vídeo está funcionando)
const backgroundVideo = document.getElementById('background-video');

// Garantir que o vídeo está tocando (alguns navegadores podem bloquear autoplay)
document.addEventListener('DOMContentLoaded', () => {
  if (backgroundVideo) {
    backgroundVideo.play().catch(err => {
      console.log('Autoplay bloqueado pelo navegador:', err);
    });
  }
});

class LottoBall extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const number = this.getAttribute('number');
    const color = this.getColor(parseInt(number));

    this.shadowRoot.innerHTML = `
      <style>
        .ball {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
          background-color: ${color.bg};
          box-shadow: 0 4px 8px rgba(0,0,0,0.3), inset 0 -4px 4px ${color.inset};
          text-shadow: 0 0 5px rgba(0,0,0,0.5);
        }
      </style>
      <div class="ball">${number}</div>
    `;
  }

  getColor(number) {
    if (number <= 10) return { bg: '#fbc400', inset: 'rgba(0,0,0,0.2)' }; // Yellow
    if (number <= 20) return { bg: '#69c8f2', inset: 'rgba(0,0,0,0.2)' }; // Blue
    if (number <= 30) return { bg: '#ff7272', inset: 'rgba(0,0,0,0.2)' }; // Red
    if (number <= 40) return { bg: '#aaa', inset: 'rgba(0,0,0,0.2)' };     // Gray
    return { bg: '#b0d840', inset: 'rgba(0,0,0,0.2)' };                  // Green
  }
}
customElements.define('lotto-ball', LottoBall);

// ... (LottoBall class remains the same)

const generateBtn = document.getElementById('generate-btn');
const lottoDisplay = document.querySelector('.lotto-display');
const historyList = document.getElementById('history-list');
const themeToggle = document.getElementById('theme-toggle');

// Theme Logic
const currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'light') {
    document.body.classList.add('light-mode');
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const theme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
});

const history = [];

generateBtn.addEventListener('click', () => {
// ... (rest of the generate logic remains the same)
  const numbers = new Set();
  while (numbers.size < 6) {
    const randomNum = Math.floor(Math.random() * 45) + 1;
    numbers.add(randomNum);
  }

  const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

  lottoDisplay.innerHTML = '';
  sortedNumbers.forEach(num => {
    const lottoBall = document.createElement('lotto-ball');
    lottoBall.setAttribute('number', num);
    lottoDisplay.appendChild(lottoBall);
  });

  if (history.length >= 5) {
      history.pop();
  }
  history.unshift(sortedNumbers);

  updateHistoryView();
});

function updateHistoryView() {
    historyList.innerHTML = '';
    history.forEach(numberSet => {
        const li = document.createElement('li');
        li.textContent = numberSet.join(', ');
        historyList.appendChild(li);
    });
}
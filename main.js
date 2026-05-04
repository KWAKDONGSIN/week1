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

// Contact form
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = '전송 중...';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    try {
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { Accept: 'application/json' },
        });

        if (response.ok) {
            formStatus.textContent = '문의가 성공적으로 전송되었습니다. 감사합니다!';
            formStatus.classList.add('success');
            contactForm.reset();
        } else {
            formStatus.textContent = '전송에 실패했습니다. 잠시 후 다시 시도해주세요.';
            formStatus.classList.add('error');
        }
    } catch {
        formStatus.textContent = '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        formStatus.classList.add('error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '문의 보내기';
    }
});

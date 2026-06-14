// ============================
// PASSWORD GENERATOR — LOGIC
// ============================

// Character sets
const CHARS = {
  upper:   'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower:   'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// DOM references
const display     = document.getElementById('passwordDisplay');
const lengthRange = document.getElementById('lengthRange');
const lengthVal   = document.getElementById('lengthVal');
const copyBtn     = document.getElementById('copyBtn');
const toggleBtn   = document.getElementById('toggleBtn');
const generateBtn = document.getElementById('generateBtn');
const strengthFill  = document.getElementById('strengthFill');
const strengthLabel = document.getElementById('strengthLabel');
const toast       = document.getElementById('toast');
const chks = {
  upper:   document.getElementById('chkUpper'),
  lower:   document.getElementById('chkLower'),
  numbers: document.getElementById('chkNumbers'),
  symbols: document.getElementById('chkSymbols'),
};

let currentPassword = '';
let isVisible = false;

// ── Generate ──────────────────────────────────────────────────────────────────
function generatePassword() {
  const length = parseInt(lengthRange.value);
  const pool = Object.entries(chks)
    .filter(([, el]) => el.checked)
    .map(([key]) => CHARS[key])
    .join('');

  if (!pool) {
    display.textContent = 'Select at least one option';
    return;
  }

  // Guarantee at least one char from each selected set
  const guaranteed = Object.entries(chks)
    .filter(([, el]) => el.checked)
    .map(([key]) => CHARS[key][Math.floor(Math.random() * CHARS[key].length)]);

  const rest = Array.from(
    { length: length - guaranteed.length },
    () => pool[Math.floor(Math.random() * pool.length)]
  );

  // Shuffle combined array (Fisher-Yates)
  const combined = [...guaranteed, ...rest];
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  currentPassword = combined.join('');
  display.textContent = isVisible ? currentPassword : mask(currentPassword);
  updateStrength(currentPassword);
}

// ── Mask / show ───────────────────────────────────────────────────────────────
function mask(pw) {
  return '•'.repeat(pw.length);
}

toggleBtn.addEventListener('click', () => {
  isVisible = !isVisible;
  toggleBtn.textContent = isVisible ? '🙈' : '👁️';
  display.textContent = isVisible ? currentPassword : mask(currentPassword);
});

// ── Strength meter ────────────────────────────────────────────────────────────
function updateStrength(pw) {
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 14) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const levels = [
    { label: 'Very Weak', color: '#ef4444', pct: '20%' },
    { label: 'Weak',      color: '#f97316', pct: '40%' },
    { label: 'Fair',      color: '#eab308', pct: '60%' },
    { label: 'Strong',    color: '#22c55e', pct: '80%' },
    { label: 'Very Strong', color: '#6366f1', pct: '100%' },
  ];
  const lvl = levels[Math.min(score, 4)];
  strengthFill.style.width    = lvl.pct;
  strengthFill.style.background = lvl.color;
  strengthLabel.textContent   = lvl.label;
  strengthLabel.style.color   = lvl.color;
}

// ── Copy ──────────────────────────────────────────────────────────────────────
copyBtn.addEventListener('click', () => {
  if (!currentPassword) return;
  navigator.clipboard.writeText(currentPassword).then(() => {
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2000);
  });
});

// ── Length slider ─────────────────────────────────────────────────────────────
lengthRange.addEventListener('input', () => {
  lengthVal.textContent = lengthRange.value;
  generatePassword();
});

// ── Generate button ───────────────────────────────────────────────────────────
generateBtn.addEventListener('click', generatePassword);

// ── Init ──────────────────────────────────────────────────────────────────────
generatePassword();

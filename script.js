const loginScreen = document.getElementById('login-screen');
const pinScreen = document.getElementById('pin-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const loginTab = document.getElementById('tab-login');
const signupTab = document.getElementById('tab-signup');
const fullnameField = document.getElementById('field-fullname');
const forgotLink = document.getElementById('link-forgot');
const submitText = document.getElementById('btn-submit-text');
const passwordInput = document.getElementById('input-password');
const eyeIcon = document.getElementById('eye-icon');
const authForm = document.getElementById('auth-form');
const navItems = document.querySelectorAll('.nav-item');
const panelButtons = document.querySelectorAll('[data-target]');
const panels = document.querySelectorAll('.panel-panel');

const pinDots = document.querySelectorAll('.pin-dot');
const statusMsg = document.getElementById('status-message');
const deleteBtn = document.getElementById('delete-btn');
const biometricBtn = document.getElementById('biometric-btn');
const pinBackBtn = document.getElementById('pin-back-btn');

let pinCode = '';
const maxPinLength = 6;
let pinVerifyTimer = null;
let pinSuccessTimer = null;

function switchAuthTab(mode) {
  if (!loginTab || !signupTab || !fullnameField || !forgotLink || !submitText) return;

  if (mode === 'signup') {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    fullnameField.classList.remove('hidden');
    fullnameField.classList.add('flex');
    forgotLink.style.display = 'none';
    submitText.textContent = 'Agree & Create Account';
  } else {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    fullnameField.classList.add('hidden');
    fullnameField.classList.remove('flex');
    forgotLink.style.display = 'inline-block';
    submitText.textContent = 'Continue to Secure PIN';
  }
}

function togglePasswordVisibility() {
  if (!passwordInput || !eyeIcon) return;

  const shouldShow = passwordInput.type === 'password';
  passwordInput.type = shouldShow ? 'text' : 'password';
  eyeIcon.textContent = shouldShow ? 'visibility_off' : 'visibility';
}

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach((screen) => {
    screen.classList.toggle('active', screen.id === screenId);
  });
}

function updatePinDots() {
  if (!pinDots.length) return;

  pinDots.forEach((dot, index) => {
    const filled = index < pinCode.length;
    dot.classList.toggle('filled', filled);
  });

  if (pinCode.length === maxPinLength) {
    if (statusMsg) {
      statusMsg.textContent = 'Verifying security credential...';
      statusMsg.classList.remove('opacity-0');
      statusMsg.classList.add('show');
    }

    if (pinSuccessTimer) window.clearTimeout(pinSuccessTimer);
    if (pinVerifyTimer) window.clearTimeout(pinVerifyTimer);

    pinSuccessTimer = window.setTimeout(() => {
      if (statusMsg) {
        statusMsg.textContent = 'Authentication Successful!';
        statusMsg.classList.remove('alert');
        statusMsg.classList.add('success');
      }

      pinVerifyTimer = window.setTimeout(() => {
        if (dashboardScreen) {
          showScreen('dashboard-screen');
          showPanel('home');
        }

        pinCode = '';
        updatePinDots();

        if (statusMsg) {
          statusMsg.classList.add('opacity-0');
          statusMsg.classList.remove('show', 'success');
        }
      }, 1200);
    }, 800);
  } else {
    if (pinSuccessTimer) window.clearTimeout(pinSuccessTimer);
    if (pinVerifyTimer) window.clearTimeout(pinVerifyTimer);

    if (statusMsg) {
      statusMsg.classList.add('opacity-0');
      statusMsg.classList.remove('show', 'success');
      statusMsg.textContent = 'Verifying security credential...';
    }
  }
}

function handlePinInput(value) {
  if (pinCode.length >= maxPinLength) return;
  pinCode += value;
  updatePinDots();
}

if (loginTab) {
  loginTab.addEventListener('click', () => switchAuthTab('login'));
}

if (signupTab) {
  signupTab.addEventListener('click', () => switchAuthTab('signup'));
}

if (document.getElementById('btn-toggle-password')) {
  document.getElementById('btn-toggle-password').addEventListener('click', togglePasswordVisibility);
}

if (authForm) {
  authForm.addEventListener('submit', (event) => {
    event.preventDefault();
    showScreen('pin-screen');
  });
}

if (pinBackBtn) {
  pinBackBtn.addEventListener('click', () => showScreen('login-screen'));
}

if (deleteBtn) {
  deleteBtn.addEventListener('click', () => {
    if (pinCode.length > 0) {
      pinCode = pinCode.slice(0, -1);
      updatePinDots();
    }
  });
}

document.querySelectorAll('.num-key').forEach((button) => {
  button.addEventListener('click', () => handlePinInput(button.dataset.value));
});

if (biometricBtn) {
  biometricBtn.addEventListener('click', () => {
    if (statusMsg) {
      statusMsg.textContent = 'Scanning Biometric Sensor...';
      statusMsg.classList.remove('opacity-0');
      statusMsg.classList.add('show');
    }

    setTimeout(() => {
      pinCode = '123456';
      updatePinDots();
    }, 600);
  });
}

function showPanel(targetName) {
  panels.forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.panel === targetName);
  });

  navItems.forEach((item) => {
    item.classList.toggle('active', item.dataset.target === targetName);
  });
}

panelButtons.forEach((button) => {
  const target = button.dataset.target;

  if (!target) return;

  button.addEventListener('click', () => showPanel(target));
});

const quickActionButtons = document.querySelectorAll('.quick-action');
quickActionButtons.forEach((button) => {
  const target = button.dataset.target;
  if (target) {
    button.addEventListener('click', () => showPanel(target));
  }
});

let isFlipped = false;
let isCvvRevealed = false;
let currentFinish = 'plum';

function toggleFlip() {
  const card = document.getElementById('card3d');
  if (!card) return;

  isFlipped = !isFlipped;
  card.classList.toggle('rotate-y-180', isFlipped);
}

function toggleCvv() {
  const cvvSecret = document.getElementById('cvvSecret');
  const cvvBtnText = document.getElementById('cvvBtnText');
  const cvvIcon = document.getElementById('cvvIcon');

  if (!cvvSecret || !cvvBtnText || !cvvIcon) return;

  isCvvRevealed = !isCvvRevealed;

  if (isCvvRevealed) {
    cvvSecret.textContent = '739';
    cvvBtnText.textContent = 'Hide';
    cvvIcon.textContent = 'visibility_off';
  } else {
    cvvSecret.textContent = '•••';
    cvvBtnText.textContent = 'Reveal';
    cvvIcon.textContent = 'visibility';
  }
}

function toggleEmbossing(enabled) {
  const cardholder = document.getElementById('cardholderDisplay');
  if (!cardholder) return;

  if (enabled) {
    cardholder.style.textShadow = '0 1px 2px rgba(255,255,255,0.3)';
  } else {
    cardholder.style.textShadow = 'none';
  }
}

function setCardFinish(themeKey) {
  currentFinish = themeKey;

  const front = document.getElementById('cardFront');
  const back = document.getElementById('cardBack');
  const finishTitle = document.getElementById('currentFinishName');
  const tierLabel = document.getElementById('cardTierLabel');

  if (!front || !back || !finishTitle || !tierLabel) return;

  front.classList.remove('finish-royal-plum', 'finish-obsidian-black', 'finish-imperial-gold');
  back.classList.remove('finish-royal-plum', 'finish-obsidian-black', 'finish-imperial-gold');

  ['plum', 'black', 'gold'].forEach((key) => {
    const btn = document.getElementById('finishBtn-' + key);
    const check = document.getElementById('check-' + key);

    if (btn) btn.classList.remove('active');
    if (check) check.classList.add('hidden');
  });

  const activeBtn = document.getElementById('finishBtn-' + themeKey);
  const activeCheck = document.getElementById('check-' + themeKey);

  if (activeBtn) activeBtn.classList.add('active');
  if (activeCheck) activeCheck.classList.remove('hidden');

  if (themeKey === 'plum') {
    front.classList.add('finish-royal-plum');
    back.classList.add('finish-royal-plum');
    finishTitle.textContent = 'Royal Plum';
    tierLabel.textContent = 'Titanium Express';
  }

  if (themeKey === 'black') {
    front.classList.add('finish-obsidian-black');
    back.classList.add('finish-obsidian-black');
    finishTitle.textContent = 'Obsidian Black';
    tierLabel.textContent = 'Carbon Matte Luxe';
  }

  if (themeKey === 'gold') {
    front.classList.add('finish-imperial-gold');
    back.classList.add('finish-imperial-gold');
    finishTitle.textContent = 'Imperial Gold';
    tierLabel.textContent = 'Champagne Aurum VIP';
  }
}

function confirmOrder() {
  const finishName = document.getElementById('currentFinishName');
  const label = finishName ? finishName.textContent : 'Royal Plum';
  window.alert('Card Order Confirmed! Your ' + label + ' OP-PAY Card will be dispatched to your Taguig address.');
}

window.addEventListener('DOMContentLoaded', () => {
  switchAuthTab('login');
  showScreen('login-screen');
  showPanel('home');
  setCardFinish('plum');
  toggleEmbossing(true);

  document.querySelectorAll('[data-show-screen]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const target = trigger.getAttribute('data-show-screen');
      if (target) showScreen(target);
    });
  });

  document.querySelectorAll('[data-back]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const target = trigger.getAttribute('data-back');
      if (target) showScreen(target);
    });
  });

  const dashboardToggleBtn = document.getElementById('toggleBalanceBtn');
  const dashboardBalanceText = document.getElementById('balanceText');
  const dashboardEyeIcon = document.getElementById('eyeIcon');
  const quickActionBtns = document.querySelectorAll('.quick-action-btn');
  const navItems = document.querySelectorAll('.nav-item');

  if (dashboardToggleBtn && dashboardBalanceText && dashboardEyeIcon) {
    let isVisible = true;
    const actualBalance = '24,850.50';

    dashboardToggleBtn.addEventListener('click', () => {
      isVisible = !isVisible;
      if (isVisible) {
        dashboardBalanceText.textContent = actualBalance;
        dashboardEyeIcon.textContent = 'visibility';
      } else {
        dashboardBalanceText.textContent = '••••••••';
        dashboardEyeIcon.textContent = 'visibility_off';
      }
    });
  }

  quickActionBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'deposit') {
        showScreen('cashin-screen');
      }

      quickActionBtns.forEach((item) => {
        const circle = item.querySelector('.action-icon-circle');
        const label = item.querySelector('.action-label');
        const icon = item.querySelector('.material-symbols-outlined');

        if (!circle || !label || !icon) return;

        circle.classList.remove('bg-[#F5B041]', 'text-[#330057]', 'ring-2', 'ring-secondary-fixed', 'shadow-md');
        circle.classList.add('bg-primary-container', 'text-secondary-fixed', 'group-hover:bg-primary', 'shadow-sm');
        circle.classList.remove('ring-2', 'ring-secondary-fixed');
        label.classList.remove('font-bold');
        label.classList.add('font-semibold');
        icon.style.fontVariationSettings = "'FILL' 0";
      });

      const activeCircle = btn.querySelector('.action-icon-circle');
      const activeLabel = btn.querySelector('.action-label');
      const activeIcon = btn.querySelector('.material-symbols-outlined');

      if (!activeCircle || !activeLabel || !activeIcon) return;

      activeCircle.classList.remove('bg-primary-container', 'text-secondary-fixed', 'group-hover:bg-primary', 'shadow-sm');
      activeCircle.classList.add('bg-[#F5B041]', 'text-[#330057]', 'shadow-md', 'ring-2', 'ring-secondary-fixed');
      activeLabel.classList.remove('font-semibold');
      activeLabel.classList.add('font-bold');
      activeIcon.style.fontVariationSettings = "'FILL' 1";
    });
  });

  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      navItems.forEach((nav) => {
        nav.classList.remove('bg-primary-container', 'text-secondary-fixed', 'shadow-sm');
        nav.classList.add('text-on-surface-variant', 'hover:text-primary', 'hover:bg-surface-container-low');

        const icon = nav.querySelector('.material-symbols-outlined');
        const label = nav.querySelector('span:last-child');
        if (icon) icon.style.fontVariationSettings = "'FILL' 0";
        if (label) {
          label.classList.remove('font-semibold');
          label.classList.add('font-medium');
        }
      });

      item.classList.remove('text-on-surface-variant', 'hover:text-primary', 'hover:bg-surface-container-low');
      item.classList.add('bg-primary-container', 'text-secondary-fixed', 'shadow-sm');

      const activeIcon = item.querySelector('.material-symbols-outlined');
      const activeLabel = item.querySelector('span:last-child');
      if (activeIcon) activeIcon.style.fontVariationSettings = "'FILL' 1";
      if (activeLabel) {
        activeLabel.classList.remove('font-medium');
        activeLabel.classList.add('font-semibold');
      }
    });
  });
});


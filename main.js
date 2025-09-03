// Переключить показ/скрытие пароля
function togglePassword() {
  const input = document.getElementById('password');
  input.type = input.type === 'password' ? 'text' : 'password';
}

// Переключить тему (светлая/тёмная)
function toggleTheme() {
  document.body.classList.toggle('dark-theme');
}

// Показать модалку ошибки
function showModal() {
  document.getElementById('errorModal').style.display = 'flex';
}

// Скрыть модалку ошибки
function closeModal() {
  document.getElementById('errorModal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const rememberCheckbox = document.getElementById('remember');
  const loader = document.getElementById('loader');

  // Загрузка сохранённого email
  const savedEmail = localStorage.getItem('savedEmail');
  if (savedEmail) {
    emailInput.value = savedEmail;
    rememberCheckbox.checked = true;
  }

  // Валидация email
  emailInput.addEventListener('input', () => {
    const errorSpan = document.getElementById('email-error');
    if (!emailInput.validity.valid) {
      errorSpan.textContent = 'Введите корректный email.';
      emailInput.classList.add('invalid');
    } else {
      errorSpan.textContent = '';
      emailInput.classList.remove('invalid');
    }
    closeModal();
  });

  // Валидация пароля
  passwordInput.addEventListener('input', () => {
    const errorSpan = document.getElementById('password-error');
    if (passwordInput.value.length < 6) {
      errorSpan.textContent = 'Минимум 6 символов.';
      passwordInput.classList.add('invalid');
    } else {
      errorSpan.textContent = '';
      passwordInput.classList.remove('invalid');
    }
    closeModal();
  });

  // Обработка отправки формы
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const remember = rememberCheckbox.checked;

    // Проверка валидности
    if (!emailInput.validity.valid || password.length < 6) {
      alert('Введите корректный email и пароль (не менее 6 символов).');
      return;
    }

    // Показать лоадер
    loader.classList.remove('hidden');

    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username: email, password: password })
      });

      loader.classList.add('hidden');

      if (!response.ok) {
        showModal();
        return;
      }

      const data = await response.json();

      localStorage.setItem('token', data.token);

      if (remember) {
        localStorage.setItem('savedEmail', email);
      } else {
        localStorage.removeItem('savedEmail');
      }

      alert('Успешный вход! 🚀');
      window.location.href = "/Login/Home.html"; // Твой переход

    } catch (error) {
      loader.classList.add('hidden');
      showModal();
    }
  });
});

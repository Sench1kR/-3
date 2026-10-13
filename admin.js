/**
 * Улучшенный единый скрипт управления режимом администратора для сайта "Точка Роста"
 */
document.addEventListener('DOMContentLoaded', () => {
    const authBtn = document.getElementById('auth-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const saveBtn = document.getElementById('save-btn');
    
    const mainSection = document.querySelector('main section');
    // Находим абсолютно все зоны редактирования на текущей странице
    const editableZones = document.querySelectorAll('.editable-zone');
    
    if (!mainSection || editableZones.length === 0) return;

    const storageKey = 'saved-content-' + mainSection.id;
    const ADMIN_PASSWORD = "admin123"; 

    // 1. Извлечение сохраненного контента. 
    // Если это страницы с карточками, мы сохраняем/загружаем внутренность всей секции, но редактировать даем только текст
    if (localStorage.getItem(storageKey)) {
        if (mainSection.id === 'page-index') {
            document.querySelector('.editable-zone').innerHTML = localStorage.getItem(storageKey);
        } else {
            // Для страниц достижений и контактов обновляем контейнер с карточками целиком
            document.querySelector('.grid-container').parentNode.innerHTML = localStorage.getItem(storageKey);
        }
    }

    // Повторно инициализируем коллекцию после возможной перезаписи из localStorage
    const activeZones = document.querySelectorAll('.editable-zone');

    // 2. Включение редактирования
    function enableEditing() {
        activeZones.forEach(zone => {
            zone.setAttribute('contenteditable', 'true');
        });
        mainSection.classList.add('edit-mode-active');
        
        if (authBtn) authBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
        if (saveBtn) saveBtn.style.display = 'inline-block';
    }

    // 3. Выключение редактирования
    function disableEditing() {
        activeZones.forEach(zone => {
            zone.removeAttribute('contenteditable');
        });
        mainSection.classList.remove('edit-mode-active');
        
        if (authBtn) authBtn.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (saveBtn) saveBtn.style.display = 'none';
    }

    // 4. Сквозная проверка авторизации
    if (sessionStorage.getItem('isAdminLogged') === 'true') {
        enableEditing();
    }

    // 5. Кнопка "Войти"
    if (authBtn) {
        authBtn.addEventListener('click', () => {
            const userPass = prompt('Введите пароль администратора:');
            if (userPass === ADMIN_PASSWORD) {
                sessionStorage.setItem('isAdminLogged', 'true');
                alert('Доступ разрешен для всех страниц!');
                enableEditing();
            } else if (userPass !== null) {
                alert('Введен неверный пароль!');
            }
        });
    }

    // 6. Кнопка "Выйти"
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('isAdminLogged');
            disableEditing();
            alert('Вы вышли из режима администратора.');
        });
    }

    // 7. Кнопка "Сохранить"
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            // Убираем рамки перед сохранением
            activeZones.forEach(zone => zone.removeAttribute('contenteditable'));
            
            // Сохраняем контент в зависимости от типа страницы
            if (mainSection.id === 'page-index') {
                localStorage.setItem(storageKey, document.querySelector('.editable-zone').innerHTML);
            } else {
                localStorage.setItem(storageKey, document.querySelector('.grid-container').parentNode.innerHTML);
            }
            
            // Возвращаем рамки назад
            activeZones.forEach(zone => zone.setAttribute('contenteditable', 'true'));

            // Эффект успеха
            saveBtn.innerText = '✓ Сохранено!';
            saveBtn.style.background = '#2e7d32';
            saveBtn.style.color = '#ffffff';
            
            setTimeout(() => {
                saveBtn.innerText = 'Сохранить страницу';
                saveBtn.style.background = '#ffffff';
                saveBtn.style.color = '#8b0000';
            }, 2000);
        });
    }
});

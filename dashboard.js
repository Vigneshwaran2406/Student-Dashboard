document.addEventListener('DOMContentLoaded', function() {
    
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

    if (!loggedUser) {
        
        window.location.href = 'index.html';
        return;
    }


    // Show username & email on navbar

    document.getElementById('profileUsername').textContent = loggedUser.username;
    document.getElementById('profileEmail').textContent = loggedUser.email;

    // Update welcome message

    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome, ${loggedUser.username}!`;
    }

    // Logout button

    if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    firebase.auth().signOut().finally(() => {
      localStorage.removeItem('loggedUser');
      window.location.href = 'index.html';
    });
  });
}

    /* Home: Clock */

    function updateClock() {
        const now = new Date();
        const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        document.getElementById('realTimeClock').textContent = now.toLocaleTimeString('en-US', options);
    }
    updateClock();
    setInterval(updateClock, 1000);

    /* Home: Random quote */

    const quoteText = document.getElementById('quoteText');
    const quoteAuthor = document.getElementById('quoteAuthor');

    async function displayRandomQuote() {
    try {
        const response = await fetch("https://quotes-api12.p.rapidapi.com/quotes/random?type=inspirational", {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": "a0d5e445a2msh0eee79243fcdac0p17e704jsnb48286b4c8e8",
                "X-RapidAPI-Host": "quotes-api12.p.rapidapi.com"
            }
        });

        if (!response.ok) throw new Error("Failed to fetch quote");
        const data = await response.json();

        quoteText.textContent = `"${data.quote}"`;
        quoteAuthor.textContent = `- ${data.author}`;
    } catch (error) {
        console.error("Quote API error:", error);
        quoteText.textContent = `"Believe you can and you're halfway there."`;
        quoteAuthor.textContent = `- Theodore Roosevelt`;
    }
}
    displayRandomQuote();


    /* Sidebar navigation */

    const navButtons = document.querySelectorAll('.nav');
    const contentSections = document.querySelectorAll('.content-section');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            navButtons.forEach(btn => btn.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            this.classList.add('active');
            const target = document.getElementById(this.dataset.target);
            if (target) target.classList.add('active');
        });
    });

    /* Subjects page */

    const subjectsData = [
        { subject: "AI", teacher: "Mr. Smith", day: "Monday", time: "09:00 AM - 10:00 AM" },
        { subject: "Data Science", teacher: "Ms. Johnson", day: "Monday", time: "10:30 AM - 11:30 AM" },
        { subject: "Machine Learning", teacher: "Dr. Lee", day: "Tuesday", time: "09:00 AM - 10:00 AM" },
        { subject: "Python", teacher: "Ms. Davis", day: "Tuesday", time: "10:30 AM - 11:30 AM" },
        { subject: "Data Structure", teacher: "Mr. Brown", day: "Wednesday", time: "09:00 AM - 10:00 AM" },
        { subject: "Statistics", teacher: "Ms. White", day: "Wednesday", time: "10:30 AM - 11:30 AM" },
        { subject: "AI", teacher: "Mr. Smith", day: "Friday", time: "10:30 AM - 11:30 AM" }
    ];

    const subjectsTableBody = document.querySelector('#subjectsTable tbody');
    const dayFilter = document.getElementById('dayFilter');
    const subjectFilter = document.getElementById('subjectFilter');

    function renderSubjectsTable(data) {
        subjectsTableBody.innerHTML = '';
        data.forEach(item => {
            const row = subjectsTableBody.insertRow();
            row.insertCell().textContent = item.subject;
            row.insertCell().textContent = item.teacher;
            row.insertCell().textContent = item.day;
            row.insertCell().textContent = item.time;
        });
    }

    function applyFilters() {
        let filtered = subjectsData;
        if (dayFilter.value !== 'all') filtered = filtered.filter(d => d.day === dayFilter.value);
        if (subjectFilter.value !== 'all') filtered = filtered.filter(d => d.subject === subjectFilter.value);
        renderSubjectsTable(filtered);
    }

    
    const uniqueSubjects = [...new Set(subjectsData.map(s => s.subject))];
    uniqueSubjects.forEach(subject => {
        const opt = document.createElement('option');
        opt.value = subject;
        opt.textContent = subject;
        subjectFilter.appendChild(opt);
    });

    dayFilter.addEventListener('change', applyFilters);
    subjectFilter.addEventListener('change', applyFilters);
    renderSubjectsTable(subjectsData);

   
    const todoInput = document.getElementById('todoInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const todoList = document.getElementById('todoList');

    const todoKey = `todos_${loggedUser.username}`;
    let tasks = JSON.parse(localStorage.getItem(todoKey)) || [];

    function saveTasks() {
        localStorage.setItem(todoKey, JSON.stringify(tasks));
    }

    function renderTasks() {
        todoList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'todo-item';
            li.dataset.index = index;
            li.innerHTML = `
                <span class="task-text">${task}</span>
                <div class="todo-actions">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>`;
            todoList.appendChild(li);
        });
    }

    addTaskButton.addEventListener('click', () => {
        const text = todoInput.value.trim();
        if (text) {
            tasks.push(text);
            todoInput.value = '';
            saveTasks();
            renderTasks();
        }
    });

    todoInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTaskButton.click(); });

    todoList.addEventListener('click', (e) => {
        const li = e.target.closest('.todo-item');
        if (!li) return;
        const index = li.dataset.index;
        if (e.target.classList.contains('delete-btn')) {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        } else if (e.target.classList.contains('edit-btn')) {
            const current = tasks[index];
            const newText = prompt('Edit task:', current);
            if (newText !== null && newText.trim() !== '') {
                tasks[index] = newText.trim();
                saveTasks();
                renderTasks();
            }
        }
    });

    renderTasks();
});

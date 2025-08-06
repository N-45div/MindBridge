const { ipcRenderer } = require('electron');

// Views
const views = document.querySelectorAll('.view');

// Menu
const menuItems = document.querySelectorAll('.menu-item');

// Chat
const chatWelcomeMessage = document.getElementById('chat-welcome');
const messages = document.getElementById('messages');
const input = document.getElementById('input');
const send = document.getElementById('send');

// Daily Log
const dailyLogTextarea = document.getElementById('daily-log-textarea');
const saveLogButton = document.getElementById('save-log');

// To-Do List
const todoInput = document.getElementById('todo-input');
const addTodoButton = document.getElementById('add-todo');
const todoList = document.getElementById('todo-list');

// Time Tracker
const timerDisplay = document.getElementById('timer-display');
const startStopTrackerButton = document.getElementById('start-stop-tracker');

// --- CHAT ---
send.addEventListener('click', () => {
  const message = input.value;
  if (message) {
    chatWelcomeMessage.style.display = 'none';
    addMessage('user', message);
    ipcRenderer.send('send-message', message);
    input.value = '';
  }
});

ipcRenderer.on('receive-message', (event, message) => {
  addMessage('assistant', message);
});

function addMessage(sender, text) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', sender);
  messageElement.textContent = text;
  messages.appendChild(messageElement);
  messages.scrollTop = messages.scrollHeight;
}

// --- NAVIGATION ---
menuItems.forEach(item => {
  item.addEventListener('click', () => {
    const view = item.getAttribute('data-view');
    showView(view);
  });
});

function showView(viewId) {
  views.forEach(view => {
    view.classList.remove('active');
  });
  document.getElementById(`${viewId}-view`).classList.add('active');

  menuItems.forEach(item => {
    item.classList.remove('active');
  });
  document.querySelector(`[data-view="${viewId}"]`).classList.add('active');
}

// --- DAILY LOG ---
saveLogButton.addEventListener('click', () => {
  const log = dailyLogTextarea.value;
  if (log) {
    ipcRenderer.send('save-log', log);
    dailyLogTextarea.value = '';
    alert('Log saved!');
  }
});

// --- TO-DO LIST ---
let todos = [];

addTodoButton.addEventListener('click', () => {
  const task = todoInput.value;
  if (task) {
    todos.push({ task, completed: false });
    renderTodos();
    todoInput.value = '';
    saveTodos();
  }
});

function renderTodos() {
  todoList.innerHTML = '';
  todos.forEach((todo, index) => {
    const todoItem = document.createElement('li');
    todoItem.classList.add('todo-item');
    if (todo.completed) {
      todoItem.classList.add('completed');
    }

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => {
      todos[index].completed = checkbox.checked;
      renderTodos();
      saveTodos();
    });

    const taskText = document.createElement('span');
    taskText.textContent = todo.task;

    todoItem.appendChild(checkbox);
    todoItem.appendChild(taskText);
    todoList.appendChild(todoItem);
  });
}

function saveTodos() {
  ipcRenderer.send('save-todos', todos);
}

ipcRenderer.on('receive-todos', (event, savedTodos) => {
  todos = savedTodos;
  renderTodos();
});

// --- TIME TRACKER ---
let timerInterval;
let seconds = 0;
let isTrackerRunning = false;

startStopTrackerButton.addEventListener('click', () => {
  if (isTrackerRunning) {
    clearInterval(timerInterval);
    ipcRenderer.send('stop-tracker');
    startStopTrackerButton.textContent = 'Start Tracking';
  } else {
    ipcRenderer.send('start-tracker');
    timerInterval = setInterval(updateTimer, 1000);
    startStopTrackerButton.textContent = 'Stop Tracking';
  }
  isTrackerRunning = !isTrackerRunning;
});

function updateTimer() {
  seconds++;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  timerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// --- INITIALIZATION ---
showView('dashboard');
ipcRenderer.send('load-todos');
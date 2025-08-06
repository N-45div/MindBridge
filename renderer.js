const { ipcRenderer } = require('electron');

// Chat
const chatWelcomeMessage = document.getElementById('chat-welcome');
const messages = document.getElementById('messages');
const input = document.getElementById('input');
const send = document.getElementById('send');

// Daily Log
const dailyLogTextarea = document.getElementById('daily-log-textarea');
const saveLogButton = document.getElementById('save-log');

saveLogButton.addEventListener('click', () => {
  const logContent = dailyLogTextarea.value.trim();
  if (logContent) {
    ipcRenderer.send('save-log', logContent);
    dailyLogTextarea.value = ''; // Clear the textarea after saving
  }
});

// Past Logs
const pastLogsContainer = document.getElementById('past-logs');

ipcRenderer.on('receive-logs', (event, logs) => {
  pastLogsContainer.innerHTML = ''; // Clear previous logs
  logs.forEach(logEntry => {
    const logDiv = document.createElement('div');
    logDiv.classList.add('log-entry');
    logDiv.innerHTML = `
      <div class="log-date">${new Date(logEntry.date).toLocaleString()}</div>
      <div class="log-content">${logEntry.log}</div>
    `;
    pastLogsContainer.prepend(logDiv); // Add new logs to the top
  });
});

// AI Insights
const aiInsightSection = document.getElementById('ai-insight-section');

ipcRenderer.on('receive-ai-insight', (event, insight) => {
  aiInsightSection.innerHTML = `<p>${insight}</p>`;
});

// --- NAVIGATION ---
document.querySelectorAll('.menu-item').forEach(item => {
  item.addEventListener('click', () => {
    const view = item.getAttribute('data-view');
    showView(view);
    if (view === 'daily-log') {
      ipcRenderer.send('load-logs'); // Load logs when daily log view is shown
    }
  });
});

function showView(viewId) {
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });
  document.getElementById(`${viewId}-view`).classList.add('active');

  document.querySelectorAll('.menu-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelector(`[data-view="${viewId}"]`).classList.add('active');
}

// --- INITIALIZATION ---
showView('dashboard');

send.addEventListener('click', () => {
  const messageText = input.value.trim();
  if (messageText) {
    // Display user message
    const userMessageElement = document.createElement('div');
    userMessageElement.classList.add('message', 'user-message');
    userMessageElement.textContent = messageText;
    messages.appendChild(userMessageElement);
    input.value = '';
    chatWelcomeMessage.style.display = 'none'; // Hide welcome message after first message

    // Send message to main process
    ipcRenderer.send('send-message', messageText);
  }
});

input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    send.click();
  }
});

ipcRenderer.on('receive-message', (event, message) => {
  const aiMessageElement = document.createElement('div');
  aiMessageElement.classList.add('message', 'ai-message');
  aiMessageElement.textContent = message;
  messages.appendChild(aiMessageElement);
});
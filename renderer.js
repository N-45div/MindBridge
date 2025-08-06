const { ipcRenderer } = require('electron');

// Chat
const chatWelcomeMessage = document.getElementById('chat-welcome');
const messages = document.getElementById('messages');
const input = document.getElementById('input');
const send = document.getElementById('send');

// Daily Log
const dailyLogTextarea = document.getElementById('daily-log-textarea');
const saveLogButton = document.getElementById('save-log');

// Past Logs
const pastLogsContainer = document.getElementById('past-logs');

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
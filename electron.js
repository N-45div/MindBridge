const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const fetch = require('node-fetch');
const fs = require('fs');
const say = require('say');

const logsPath = path.join(app.getPath('userData'), 'daily-logs.json');
const todosPath = path.join(app.getPath('userData'), 'todos.json');

let reminderInterval;
let nextReminder = '';

async function fetchNextReminder() {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemma3n:e2b-it-q4_K_M',
        prompt: 'Generate a short, friendly, and encouraging wellness reminder. For example: "Time for a quick stretch!" or "Don\'t forget to drink some water!"',
        stream: false,
      }),
    });
    const data = await response.json();
    nextReminder = data.response;
  } catch (error) {
    console.error('Error fetching reminder:', error);
    nextReminder = 'It seems I had a problem thinking of a reminder, but this is your reminder to take a break!';
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('chat.html');
}

app.whenReady().then(createWindow);

ipcMain.on('send-message', async (event, message) => {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemma3n:e2b-it-q4_K_M',
        prompt: message,
        stream: false,
      }),
    });

    const data = await response.json();
    event.reply('receive-message', data.response);
  } catch (error) {
    console.error('Error communicating with Ollama:', error);
    event.reply('receive-message', 'Error: Could not connect to the AI.');
  }
});

ipcMain.on('save-log', (event, log) => {
  let logs = [];
  if (fs.existsSync(logsPath)) {
    logs = JSON.parse(fs.readFileSync(logsPath));
  }
  logs.push({ date: new Date().toISOString(), log });
  fs.writeFileSync(logsPath, JSON.stringify(logs, null, 2));
});

ipcMain.on('save-todos', (event, todos) => {
  fs.writeFileSync(todosPath, JSON.stringify(todos, null, 2));
});

ipcMain.on('load-todos', (event) => {
  if (fs.existsSync(todosPath)) {
    const todos = JSON.parse(fs.readFileSync(todosPath));
    event.reply('receive-todos', todos);
  }
});

ipcMain.on('start-tracker', () => {
  fetchNextReminder(); // Pre-fetch the first reminder
  reminderInterval = setInterval(() => {
    new Notification({ title: 'MindBridge Reminder', body: nextReminder }).show();
    say.speak(nextReminder);
    fetchNextReminder(); // Fetch the next reminder
  }, 120000); // 2 minutes for demo purposes
});

ipcMain.on('stop-tracker', () => {
  clearInterval(reminderInterval);
});

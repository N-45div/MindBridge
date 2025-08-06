const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const fetch = require('node-fetch');
const fs = require('fs');
const say = require('say');

const logsPath = path.join(app.getPath('userData'), 'daily-logs.json');

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
    const wellnessCoachPrompt = `You are MindBridge, a compassionate and encouraging wellness coach. Your goal is to provide supportive, positive, and helpful advice related to mental well-being, productivity, and healthy habits. Always respond in a friendly and empathetic tone. User: ${message}`;
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemma3n:e2b-it-q4_K_M',
        prompt: wellnessCoachPrompt,
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

ipcMain.on('save-log', async (event, log) => {
  let logs = [];
  if (fs.existsSync(logsPath)) {
    logs = JSON.parse(fs.readFileSync(logsPath));
  }
  logs.push({ date: new Date().toISOString(), log });
  fs.writeFileSync(logsPath, JSON.stringify(logs, null, 2));

  // AI Analysis of the log
  try {
    const analysisPrompt = `Analyze the following daily log entry and provide a concise, encouraging, and personalized insight or summary. Focus on themes, emotional tone, or recurring patterns. Keep it to 2-3 sentences. Log: "${log}"`;
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemma3n:e2b-it-q4_K_M',
        prompt: analysisPrompt,
        stream: false,
      }),
    });
    const data = await response.json();
    const insight = data.response;
    event.reply('receive-ai-insight', insight);
  } catch (error) {
    console.error('Error analyzing log with Ollama:', error);
    event.reply('receive-ai-insight', 'Could not generate AI insight for this log.');
  }
  event.reply('log-saved'); // Optional: send confirmation back
});

ipcMain.on('load-logs', (event) => {
  if (fs.existsSync(logsPath)) {
    const logs = JSON.parse(fs.readFileSync(logsPath));
    event.reply('receive-logs', logs);
  } else {
    event.reply('receive-logs', []);
  }
});



const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

let activeDownload = null;

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile(path.join(__dirname, 'src', 'index.html'));
}

function resolveToolPath(fileName) {
  const localTool = path.join(process.resourcesPath, 'bin', fileName);
  if (fs.existsSync(localTool)) {
    return localTool;
  }
  return fileName;
}

function buildArgs({ url, mode, outputDir }) {
  const outputTemplate = path.join(outputDir, '%(title)s [%(id)s].%(ext)s');

  if (mode === 'audio') {
    return [
      '--newline',
      '--extract-audio',
      '--audio-format', 'mp3',
      '--audio-quality', '0',
      '-o', outputTemplate,
      url
    ];
  }

  return [
    '--newline',
    '-f', 'bv*+ba/b',
    '--merge-output-format', 'mp4',
    '-o', outputTemplate,
    url
  ];
}

ipcMain.handle('dialog:selectOutput', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory']
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  return result.filePaths[0];
});

ipcMain.handle('download:start', async (_event, payload) => {
  if (activeDownload) {
    return { ok: false, error: 'A download is already running.' };
  }

  const ytDlpPath = resolveToolPath('yt-dlp.exe');
  const args = buildArgs(payload);

  return new Promise((resolve) => {
    try {
      activeDownload = spawn(ytDlpPath, args, { windowsHide: true });
    } catch (error) {
      resolve({ ok: false, error: error.message });
      return;
    }

    _event.sender.send('download:log', `Running: ${ytDlpPath}`);

    activeDownload.stdout.on('data', (chunk) => {
      _event.sender.send('download:log', chunk.toString());
    });

    activeDownload.stderr.on('data', (chunk) => {
      _event.sender.send('download:log', chunk.toString());
    });

    activeDownload.on('error', (error) => {
      activeDownload = null;
      resolve({
        ok: false,
        error: `Could not start yt-dlp. Install yt-dlp and ffmpeg or place yt-dlp.exe in app resources/bin. (${error.message})`
      });
    });

    activeDownload.on('close', (code) => {
      activeDownload = null;
      if (code === 0) {
        resolve({ ok: true });
      } else {
        resolve({ ok: false, error: `yt-dlp exited with code ${code}` });
      }
    });
  });
});

ipcMain.handle('download:cancel', async () => {
  if (activeDownload) {
    activeDownload.kill();
    activeDownload = null;
    return true;
  }
  return false;
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

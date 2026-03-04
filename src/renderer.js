const urlInput = document.getElementById('url');
const modeInput = document.getElementById('mode');
const outputInput = document.getElementById('output');
const browseBtn = document.getElementById('browse');
const downloadBtn = document.getElementById('download');
const cancelBtn = document.getElementById('cancel');
const statusLabel = document.getElementById('status');
const logView = document.getElementById('log');

function setStatus(message, isError = false) {
  statusLabel.textContent = message;
  statusLabel.style.color = isError ? '#ff8d8d' : '#8ce99a';
}

function appendLog(message) {
  logView.textContent += message.endsWith('\n') ? message : `${message}\n`;
  logView.scrollTop = logView.scrollHeight;
}

browseBtn.addEventListener('click', async () => {
  const folder = await window.tubdown.selectOutputFolder();
  if (folder) {
    outputInput.value = folder;
  }
});

downloadBtn.addEventListener('click', async () => {
  const url = urlInput.value.trim();
  const mode = modeInput.value;
  const outputDir = outputInput.value.trim();

  if (!url || !outputDir) {
    setStatus('Please provide URL and output folder.', true);
    return;
  }

  logView.textContent = '';
  setStatus('Starting download...');

  const result = await window.tubdown.startDownload({ url, mode, outputDir });
  if (result.ok) {
    setStatus('Download completed.');
  } else {
    setStatus(result.error || 'Download failed.', true);
  }
});

cancelBtn.addEventListener('click', async () => {
  const cancelled = await window.tubdown.cancelDownload();
  if (cancelled) {
    setStatus('Download cancelled.', true);
  }
});

window.tubdown.onLog((message) => {
  appendLog(message);
});

setStatus('Idle');

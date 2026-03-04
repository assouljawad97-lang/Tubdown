# Tubdown (Electron desktop app for Windows)

Tubdown is a real desktop UI app (ElectronJS) for downloading YouTube videos on Windows.

## What you get
- Windows desktop GUI (URL input, mode selector, output folder picker, live logs).
- MP4 video downloads (best available) or MP3 audio extraction.
- Installer build support via `electron-builder` (NSIS `.exe` installer).

## 1) Install requirements on Windows
Open PowerShell as Administrator:

```powershell
winget install --id OpenJS.NodeJS.LTS -e
winget install --id yt-dlp.yt-dlp -e
winget install --id Gyan.FFmpeg -e
```

## 2) Run app in development mode
```powershell
npm install
npm start
```

## 3) Build Windows installer (.exe)
```powershell
npm run dist
```

After build, installer is created in `dist/` (example: `Tubdown-Setup-1.0.0.exe`).

## Optional: bundle yt-dlp in installer
If you want app users to install without separately installing yt-dlp, place `yt-dlp.exe` in:

- `resources/bin/yt-dlp.exe` inside packaged app resources

(You can automate this in a custom packaging step later.)

## Legal note
Only download content when you have permission from the content owner and platform terms allow it.

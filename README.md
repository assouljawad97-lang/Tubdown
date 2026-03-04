# Tubdown (Windows YouTube Downloader)

A ready-to-use Windows script for downloading YouTube videos using `yt-dlp`.

## What this gives you
- A simple interactive PowerShell app (`download_youtube.ps1`).
- MP4 video download (best quality available) and optional audio-only mode.
- Works on Windows 10/11.

## 1) Install prerequisites on Windows
Open **PowerShell as Administrator** and run:

```powershell
winget install --id yt-dlp.yt-dlp -e
winget install --id Gyan.FFmpeg -e
```

> If `winget` is unavailable, install from:
> - https://github.com/yt-dlp/yt-dlp
> - https://ffmpeg.org/download.html

## 2) Run the app
From PowerShell in this folder:

```powershell
powershell -ExecutionPolicy Bypass -File .\download_youtube.ps1
```

Then paste your YouTube URL, choose mode, and the output folder.

## Notes
- Download only content you are allowed to download.
- Some videos may be unavailable depending on region, age restrictions, or platform limits.

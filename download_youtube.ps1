$ErrorActionPreference = 'Stop'

function Require-Command {
    param([string]$CommandName)

    if (-not (Get-Command $CommandName -ErrorAction SilentlyContinue)) {
        Write-Host "Missing required tool: $CommandName" -ForegroundColor Red
        Write-Host "Please install it first, then run this script again." -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "=== Tubdown: YouTube Downloader ===" -ForegroundColor Cyan

Require-Command -CommandName "yt-dlp"
Require-Command -CommandName "ffmpeg"

$url = Read-Host "Enter YouTube video URL"
if ([string]::IsNullOrWhiteSpace($url)) {
    Write-Host "URL cannot be empty." -ForegroundColor Red
    exit 1
}

Write-Host "Select mode:" -ForegroundColor Cyan
Write-Host "1) Video (MP4)"
Write-Host "2) Audio only (MP3)"
$mode = Read-Host "Choose 1 or 2"

$outputDir = Read-Host "Output folder (blank = current folder)"
if ([string]::IsNullOrWhiteSpace($outputDir)) {
    $outputDir = (Get-Location).Path
}

if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

$outputTemplate = Join-Path $outputDir "%(title)s [%(id)s].%(ext)s"

try {
    if ($mode -eq '2') {
        Write-Host "Downloading audio as MP3..." -ForegroundColor Green
        yt-dlp `
            --extract-audio `
            --audio-format mp3 `
            --audio-quality 0 `
            -o $outputTemplate `
            $url
    }
    else {
        Write-Host "Downloading best MP4 video + audio..." -ForegroundColor Green
        yt-dlp `
            -f "bv*+ba/b" `
            --merge-output-format mp4 `
            -o $outputTemplate `
            $url
    }

    Write-Host "Done. File saved to: $outputDir" -ForegroundColor Cyan
}
catch {
    Write-Host "Download failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

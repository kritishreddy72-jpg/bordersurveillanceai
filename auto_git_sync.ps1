# ==============================================================================
# AURA-BORDER AI - Real-Time GitHub Auto-Sync & File Watcher Daemon
# Automatically detects file edits and pushes changes to GitHub in real time.
# ==============================================================================

param(
    [string]$GitHubToken = ""
)

$repoOwner = "kritishreddy72-jpg"
$repoName  = "bordersurveillanceai"
$watchPath = "C:\Users\K RITISH REDDY\OneDrive\Desktop\ai-border-surveillance"
$tokenFile = Join-Path $watchPath ".github_token"

# Load saved token if available
if (-not $GitHubToken -and (Test-Path $tokenFile)) {
    $GitHubToken = (Get-Content $tokenFile -Raw).Trim()
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  AURA-BORDER AI - REAL-TIME GITHUB AUTO-SYNC WATCHER    " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Watching Directory: $watchPath" -ForegroundColor Yellow
Write-Host "Target Repository : https://github.com/$repoOwner/$repoName" -ForegroundColor Yellow

if (-not $GitHubToken) {
    Write-Host "`n[SETUP REQUIRED] Please enter your GitHub Personal Access Token (PAT):" -ForegroundColor White
    Write-Host "1. Get token at: https://github.com/settings/tokens (select 'repo' scope)" -ForegroundColor Gray
    $GitHubToken = Read-Host "Paste GitHub Token"
    if ($GitHubToken) {
        $GitHubToken.Trim() | Out-File $tokenFile -Force
        Write-Host "Token saved securely to .github_token" -ForegroundColor Green
    } else {
        Write-Host "No token provided. Running in local tracking mode." -ForegroundColor Red
        return
    }
}

# Function to upload/update a file via GitHub REST API (No Git CLI needed)
function Push-FileToGitHub {
    param(
        [string]$FilePath,
        [string]$RelativePath
    )

    $url = "https://api.github.com/repos/$repoOwner/$repoName/contents/$RelativePath"
    $bytes = [System.IO.File]::ReadAllBytes($FilePath)
    $base64 = [System.Convert]::ToBase64String($bytes)
    
    $headers = @{
        "Authorization" = "Bearer $GitHubToken"
        "Accept"        = "application/vnd.github.v3+json"
        "User-Agent"    = "AutoSync-Script"
    }

    # Check if file already exists to get SHA for update
    $sha = $null
    try {
        $existing = Invoke-RestMethod -Uri $url -Headers $headers -Method Get -ErrorAction SilentlyContinue
        if ($existing -and $existing.sha) {
            $sha = $existing.sha
        }
    } catch {}

    $bodyObj = @{
        message = "Auto-update $RelativePath at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        content = $base64
        branch  = "main"
    }
    if ($sha) { $bodyObj["sha"] = $sha }

    $jsonBody = $bodyObj | ConvertTo-Json -Compress

    try {
        $result = Invoke-RestMethod -Uri $url -Headers $headers -Method Put -Body $jsonBody -ContentType "application/json"
        Write-Host "[SUCCESS] Auto-pushed: $RelativePath -> GitHub" -ForegroundColor Green
    } catch {
        Write-Host "[ERROR] Failed to push $RelativePath : $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Function to push all project files
function Push-AllProjectFiles {
    Write-Host "`n[SYNC] Pushing all project files to GitHub..." -ForegroundColor Cyan
    $files = Get-ChildItem -Path $watchPath -Recurse -File | Where-Object { 
        $_.FullName -notmatch '\.git' -and 
        $_.Name -ne '.github_token' -and 
        $_.Name -ne 'auto_sync.bat' -and
        $_.Name -ne 'auto_git_sync.ps1'
    }

    foreach ($f in $files) {
        $rel = $f.FullName.Substring($watchPath.Length + 1).Replace("\", "/")
        Push-FileToGitHub -FilePath $f.FullName -RelativePath $rel
    }
    Write-Host "[DONE] All files synchronized! Live deployment updated.`n" -ForegroundColor Green
}

# Initial full push
Push-AllProjectFiles

# Initialize FileSystemWatcher
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $watchPath
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true
$watcher.NotifyFilter = [System.IO.NotifyFilters]'FileName, LastWrite'

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  ACTIVE & LISTENING: Edit any file to auto-push!         " -ForegroundColor White
Write-Host "  (Keep this window open or minimized in background)     " -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Green

$lastChange = [DateTime]::MinValue

while ($true) {
    $change = $watcher.WaitForChanged([System.IO.WatcherChangeTypes]::All, 1000)
    if ($change.TimedOut) { continue }

    $changedPath = $change.Name
    if ($changedPath -match '\.git' -or $changedPath -match '\.github_token') { continue }

    # Debounce rapid file writes (wait 1.5s)
    $now = Get-Date
    if (($now - $lastChange).TotalMilliseconds -lt 1500) { continue }
    $lastChange = $now

    $fullPath = Join-Path $watchPath $changedPath
    if (Test-Path $fullPath -PathType Leaf) {
        $rel = $changedPath.Replace("\", "/")
        Write-Host "`n[CHANGE DETECTED] $rel was modified at $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Yellow
        Push-FileToGitHub -FilePath $fullPath -RelativePath $rel
    }
}

# ==============================================================================
# AURA-BORDER AI - Native Full-Stack HTTP & REST API Server
# Hosts Frontend Dashboard (C2 & Future Tech) and Backend Telemetry API
# ==============================================================================

$port = 8080
$rootFolder = "C:\Users\K RITISH REDDY\OneDrive\Desktop\ai-border-surveillance"

$url = "http://localhost:$port/"
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  AURA-BORDER AI - FULL-STACK PRODUCTION SERVER           " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Project Root : $rootFolder" -ForegroundColor Yellow
Write-Host "Frontend URL : http://localhost:$port/frontend/index.html" -ForegroundColor Green
Write-Host "Future Tech  : http://localhost:$port/frontend/future-tech.html" -ForegroundColor Cyan
Write-Host "Backend API  : http://localhost:$port/api/v1/status" -ForegroundColor Yellow

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)
try {
    $listener.Start()
} catch {
    $port = 8081
    $url = "http://localhost:$port/"
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($url)
    $listener.Start()
    Write-Host "Port 8080 occupied; switched to: $url" -ForegroundColor Yellow
}

# Open Frontend in Browser
Start-Process "http://localhost:$port/frontend/index.html"

Write-Host "`n[SERVER ACTIVE] Listening for HTTP & API requests..." -ForegroundColor Green

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $path = $request.Url.LocalPath

        # Handle REST API Routes
        if ($path -eq "/api/v1/status") {
            $response.ContentType = "application/json"
            $json = @{
                system = "AURA-BORDER AI DEFENSE PLATFORM"
                status = "OPERATIONAL"
                version = "4.2.0-PROD"
                timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss UTC")
                cameras = @{
                    "CAM-01" = @{ sector = "Alpha"; target = "Wolf"; rule = "SILENT_SMS" }
                    "CAM-02" = @{ sector = "Bravo"; target = "Human"; rule = "AUDIBLE_SIREN" }
                    "CAM-03" = @{ sector = "Charlie"; condition = "Dense Fog"; rule = "AVF_DEHAZE" }
                    "CAM-04" = @{ sector = "Delta"; condition = "Digging"; depth = "-8.4m"; radius = "74.6m" }
                }
                geophone_array = @{ active_nodes = 12; triggered_nodes = @(6, 7, 8) }
            } | ConvertTo-Json -Depth 4
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.OutputStream.Close()
            continue
        }

        # Handle Static Frontend Routes
        if ($path -eq "/" -or $path -eq "") {
            $path = "/frontend/index.html"
        }

        $filePath = Join-Path $rootFolder ($path.TrimStart("/").Replace("/", "\"))
        
        # Fallback check inside frontend/
        if (-not (Test-Path $filePath -PathType Leaf)) {
            $fallback = Join-Path $rootFolder "frontend\$($path.TrimStart('/'))"
            if (Test-Path $fallback -PathType Leaf) {
                $filePath = $fallback
            }
        }

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = "text/html"
            switch ($ext) {
                ".css"  { $contentType = "text/css" }
                ".js"   { $contentType = "application/javascript" }
                ".json" { $contentType = "application/json" }
                ".png"  { $contentType = "image/png" }
                ".jpg"  { $contentType = "image/jpeg" }
                ".svg"  { $contentType = "image/svg+xml" }
                ".wav"  { $contentType = "audio/wav" }
                ".mp3"  { $contentType = "audio/mpeg" }
            }
            $response.ContentType = $contentType
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.OutputStream.Close()
    } catch {
        # Continue server loop
    }
}

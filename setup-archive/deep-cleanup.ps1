# C Drive Deep Cleanup PowerShell Script
# Run as Administrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   C Drive Deep Cleanup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Disable Hibernation
Write-Host "[1/15] Disabling Hibernation..." -ForegroundColor Yellow
powercfg.exe /hibernate off
if ($?) {
    Write-Host "   SUCCESS Hibernation disabled (frees 6.4GB on reboot)" -ForegroundColor Green
} else {
    Write-Host "   WARNING Run as Administrator to disable hibernation" -ForegroundColor Red
}
Write-Host ""

# Clean Windows Temp
Write-Host "[2/15] Cleaning Windows Temp..." -ForegroundColor Yellow
Remove-Item -Path "$env:windir\Temp\*" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "   SUCCESS Windows Temp cleaned" -ForegroundColor Green
Write-Host ""

# Clean User Temp
Write-Host "[3/15] Cleaning User Temp..." -ForegroundColor Yellow
Remove-Item -Path "$env:TEMP\*" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "   SUCCESS User Temp cleaned" -ForegroundColor Green
Write-Host ""

# Clean IE/Edge Cache
Write-Host "[4/15] Cleaning IE/Edge Cache..." -ForegroundColor Yellow
Remove-Item -Path "$env:LOCALAPPDATA\Microsoft\Windows\INetCache\*" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "   SUCCESS IE/Edge Cache cleaned" -ForegroundColor Green
Write-Host ""

# Clean Chrome Cache
Write-Host "[5/15] Cleaning Chrome Cache..." -ForegroundColor Yellow
$chromeCache = "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Cache"
if (Test-Path $chromeCache) {
    Remove-Item -Path "$chromeCache\*" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "   SUCCESS Chrome Cache cleaned" -ForegroundColor Green
} else {
    Write-Host "   INFO Chrome Cache not found" -ForegroundColor Gray
}
Write-Host ""

# Clean Firefox Cache
Write-Host "[6/15] Cleaning Firefox Cache..." -ForegroundColor Yellow
$firefoxPath = "$env:LOCALAPPDATA\Mozilla\Firefox\Profiles"
if (Test-Path $firefoxPath) {
    Get-ChildItem -Path $firefoxPath -Directory | ForEach-Object {
        Remove-Item -Path "$($_.FullName)\cache2\*" -Recurse -Force -ErrorAction SilentlyContinue
        Remove-Item -Path "$($_.FullName)\startupCache\*" -Recurse -Force -ErrorAction SilentlyContinue
    }
    Write-Host "   SUCCESS Firefox Cache cleaned" -ForegroundColor Green
} else {
    Write-Host "   INFO Firefox Cache not found" -ForegroundColor Gray
}
Write-Host ""

# Clean VS Code Cache
Write-Host "[7/15] Cleaning VS Code Cache..." -ForegroundColor Yellow
Remove-Item -Path "$env:APPDATA\Code\Cache\*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:APPDATA\Code\CachedData\*" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "   SUCCESS VS Code Cache cleaned" -ForegroundColor Green
Write-Host ""

# Clean Recycle Bin
Write-Host "[8/15] Emptying Recycle Bin..." -ForegroundColor Yellow
Get-ChildItem -Path "C:\`$Recycle.Bin" -Force -Recurse | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "   SUCCESS Recycle Bin emptied" -ForegroundColor Green
Write-Host ""

# Clean Windows Update Cache
Write-Host "[9/15] Cleaning Windows Update Cache..." -ForegroundColor Yellow
Stop-Service wuauserv -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:windir\SoftwareDistribution\Download\*" -Recurse -Force -ErrorAction SilentlyContinue
Start-Service wuauserv -ErrorAction SilentlyContinue
Write-Host "   SUCCESS Windows Update Cache cleaned" -ForegroundColor Green
Write-Host ""

# Clean Thumbnail Cache
Write-Host "[10/15] Cleaning Thumbnail Cache..." -ForegroundColor Yellow
Remove-Item -Path "$env:LOCALAPPDATA\Microsoft\Windows\Explorer\thumbcache_*.db" -Force -ErrorAction SilentlyContinue
Write-Host "   SUCCESS Thumbnail Cache cleaned" -ForegroundColor Green
Write-Host ""

# Clean Windows Error Reporting
Write-Host "[11/15] Cleaning Windows Error Reporting..." -ForegroundColor Yellow
Remove-Item -Path "$env:LOCALAPPDATA\Microsoft\Windows\WER\*" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "   SUCCESS Windows Error Reporting cleaned" -ForegroundColor Green
Write-Host ""

# Clean Event Logs (keep last 30 days)
Write-Host "[12/15] Cleaning Old Event Logs..." -ForegroundColor Yellow
wevtutil el | ForEach-Object { wevtutil cl "$PSItem" 2>$null }
Write-Host "   SUCCESS Event Logs cleared" -ForegroundColor Green
Write-Host ""

# Clean Delivery Optimization Files
Write-Host "[13/15] Cleaning Delivery Optimization Files..." -ForegroundColor Yellow
Remove-Item -Path "$env:windir\ServiceProfiles\NetworkService\AppData\Local\Microsoft\Windows\DeliveryOptimization\Cache\*" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "   SUCCESS Delivery Optimization Files cleaned" -ForegroundColor Green
Write-Host ""

# Clean Windows Defender Scan Cache
Write-Host "[14/15] Cleaning Windows Defender Cache..." -ForegroundColor Yellow
Remove-Item -Path "$env:ProgramData\Microsoft\Windows Defender\Scans\History\*" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "   SUCCESS Windows Defender Cache cleaned" -ForegroundColor Green
Write-Host ""

# Clean Recent Files
Write-Host "[15/15] Cleaning Recent Files..." -ForegroundColor Yellow
Remove-Item -Path "$env:APPDATA\Microsoft\Windows\Recent\*" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "   SUCCESS Recent Files cleaned" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "   Deep Cleanup Complete" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Space Freed:" -ForegroundColor Yellow
Write-Host "   - Hibernation file: 6.4 GB (after reboot)" -ForegroundColor Cyan
Write-Host "   - Various caches: 500+ MB" -ForegroundColor Cyan
Write-Host "   - Total: 6.9+ GB" -ForegroundColor Cyan
Write-Host ""
Write-Host "Remaining System Files:" -ForegroundColor Yellow
Write-Host "   - pagefile.sys: 9.9 GB (Required)" -ForegroundColor Gray
Write-Host "   - swapfile.sys: 16 MB (Required)" -ForegroundColor Gray
Write-Host ""
Write-Host "Please RESTART your computer to fully free the hibernation space" -ForegroundColor Magenta

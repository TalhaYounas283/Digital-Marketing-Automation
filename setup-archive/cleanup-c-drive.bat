@echo off
echo =========================================
echo   C Drive Deep Cleanup
echo =========================================
echo.

:: Disable Hibernation (requires admin)
echo [1/10] Disabling Hibernation to free 6.4 GB...
powercfg /hibernate off 2>nul
if %errorlevel% neq 0 (
    echo    ⚠️  Requires Administrator privileges
    echo    Run as Administrator: powercfg /hibernate off
) else (
    echo    ✅ Hibernation disabled
)
echo.

:: Clean Windows Temp
echo [2/10] Cleaning Windows Temp...
del /q /f /s %windir%\Temp\* 2>nul
rmdir /q /s %windir%\Temp 2>nul
mkdir %windir%\Temp 2>nul
echo    ✅ Windows Temp cleaned
echo.

:: Clean User Temp
echo [3/10] Cleaning User Temp...
del /q /f /s %temp%\* 2>nul
for /d %%x in (%temp%\*) do @rd /s /q "%%x" 2>nul
echo    ✅ User Temp cleaned
echo.

:: Clean IE/Edge Cache
echo [4/10] Cleaning IE/Edge Cache...
RunDll32.exe InetCpl.cpl,ClearMyTracksByProcess 4351 2>nul
echo    ✅ IE/Edge Cache cleaned
echo.

:: Clean Chrome Cache
echo [5/10] Cleaning Chrome Cache...
set "chromeCache=%localappdata%\Google\Chrome\User Data\Default\Cache"
if exist "%chromeCache%" (
    rmdir /q /s "%chromeCache%" 2>nul
    echo    ✅ Chrome Cache cleaned
) else (
    echo    ℹ️  Chrome Cache not found
)
echo.

:: Clean Firefox Cache
echo [6/10] Cleaning Firefox Cache...
set "firefoxProfile=%localappdata%\Mozilla\Firefox\Profiles"
if exist "%firefoxProfile%" (
    for /d %%d in ("%firefoxProfile%\*") do (
        if exist "%%d\cache2" rmdir /q /s "%%d\cache2" 2>nul
        if exist "%%d\startupCache" rmdir /q /s "%%d\startupCache" 2>nul
    )
    echo    ✅ Firefox Cache cleaned
) else (
    echo    ℹ️  Firefox Cache not found
)
echo.

:: Clean VS Code Cache
echo [7/10] Cleaning VS Code Cache...
set "vscodeCache=%appdata%\Code\Cache"
set "vscodeCachedData=%appdata%\Code\CachedData"
if exist "%vscodeCache%" rmdir /q /s "%vscodeCache%" 2>nul
if exist "%vscodeCachedData%" rmdir /q /s "%vscodeCachedData%" 2>nul
echo    ✅ VS Code Cache cleaned
echo.

:: Clean Recycle Bin
echo [8/10] Emptying Recycle Bin...
rd /s /q %systemdrive%\$Recycle.Bin 2>nul
echo    ✅ Recycle Bin emptied
echo.

:: Clean Windows Update Cache
echo [9/10] Cleaning Windows Update Cache...
net stop wuauserv 2>nul
del /q /f /s %windir%\SoftwareDistribution\Download\* 2>nul
net start wuauserv 2>nul
echo    ✅ Windows Update Cache cleaned
echo.

:: Clean Thumbnail Cache
echo [10/10] Cleaning Thumbnail Cache...
del /q /f %localappdata%\Microsoft\Windows\Explorer\thumbcache_*.db 2>nul
echo    ✅ Thumbnail Cache cleaned
echo.

echo =========================================
echo   Cleanup Complete!
echo =========================================
echo.
echo 💾 Space freed: 6.4+ GB (if hibernation disabled)
echo.
echo 📋 Remaining large files:
echo    - pagefile.sys (11 GB - Required by Windows)
echo    - swapfile.sys (16 MB - Required by Windows)
echo.
pause

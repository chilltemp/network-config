<#
.SYNOPSIS
    Reboots the machine into Debian for a single session.
    The next manual reboot will return to Windows automatically.

    powershell.exe -ExecutionPolicy Bypass -File "C:\Path\To\Your\CodeMode.ps1"
#>

# 1. PASTE YOUR DEBIAN GUID HERE:
$debianGuid = "{PASTE-YOUR-GUID-HERE}"

if ($debianGuid -eq "{PASTE-YOUR-GUID-HERE}") {
    Write-Error "Set the Debian GUID first. Use: bcdedit /enum firmware"
    Pause
    exit 1
}

# 2. Check for Administrator privileges
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Error "This script must be run as Administrator."
    Pause
    exit 1
}

Write-Host "Setting Debian ($debianGuid) as the next boot target..." -ForegroundColor Cyan

# 3. Set the 'one-time' boot order (Firmware Boot Manager)
# This adds Debian to the top for the NEXT boot only.
bcdedit /set "{fwbootmgr}" displayorder $debianGuid /addfirst

if ($LASTEXITCODE -eq 0) {
    Write-Host "Success! System will now reboot into Debian." -ForegroundColor Green
    Write-Host "After your session, simply 'reboot' from Debian to return to Windows." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
    shutdown /r /t 0
} else {
    Write-Error "Failed to set boot order. Please check the GUID."
    Pause
    exit 1
}

<#
.SYNOPSIS
    Sets Debian as the persistent default boot target and reboots now.

.NOTES
    Use this when you want multiple reboots to remain in Debian.
    To restore Windows as default later, run:
    .\Restore Windows as Primary Boot.ps1
#>

param(
    [Parameter(Mandatory = $true)]
    [string]$DebianGuid
)

$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Error "This script must be run as Administrator."
    Pause
    exit 1
}

if (-not $DebianGuid.StartsWith("{")) {
    $DebianGuid = "{$DebianGuid}"
}

Write-Host "Setting Debian ($DebianGuid) as persistent default boot target..." -ForegroundColor Cyan
bcdedit /default $DebianGuid

if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to set Debian as default. Verify the GUID from 'bcdedit /enum firmware'."
    Pause
    exit 1
}

Write-Host "Debian is now the persistent default. Rebooting..." -ForegroundColor Green
Start-Sleep -Seconds 2
shutdown /r /t 0

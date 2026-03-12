<#
.SYNOPSIS
    Restores Windows Boot Manager as the persistent default boot target.
#>

param(
    [string]$WindowsGuid = "{bootmgr}"
)

$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Error "This script must be run as Administrator."
    Pause
    exit 1
}

Write-Host "Restoring Windows as persistent default boot target..." -ForegroundColor Cyan
bcdedit /default $WindowsGuid

if ($LASTEXITCODE -eq 0) {
    Write-Host "Windows is now the persistent default boot target." -ForegroundColor Green
} else {
    Write-Error "Failed to restore Windows default boot target."
    Pause
    exit 1
}

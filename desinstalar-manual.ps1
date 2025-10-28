# Script de desinstalación manual de FVX Showroom
# Ejecutar como Administrador: Click derecho → "Ejecutar con PowerShell"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Desinstalación Manual - FVX Showroom" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si se ejecuta como administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️  ADVERTENCIA: No estás ejecutando como Administrador" -ForegroundColor Yellow
    Write-Host "   Algunas operaciones pueden fallar." -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "¿Continuar de todos modos? (S/N)"
    if ($continue -ne "S" -and $continue -ne "s") {
        exit
    }
}

Write-Host "🔍 Buscando instalación de FVX Showroom..." -ForegroundColor Yellow
Write-Host ""

# Lista de posibles ubicaciones
$installPaths = @(
    "C:\Program Files\FVX Showroom",
    "C:\Program Files (x86)\FVX Showroom",
    "$env:LOCALAPPDATA\Programs\FVX Showroom"
)

# Buscar y eliminar carpetas de instalación
$found = $false
foreach ($path in $installPaths) {
    if (Test-Path $path) {
        Write-Host "✓ Encontrado: $path" -ForegroundColor Green
        $found = $true
        
        # Intentar cerrar la aplicación si está corriendo
        Get-Process | Where-Object {$_.ProcessName -like "*FVX*" -or $_.ProcessName -like "*Showroom*"} | ForEach-Object {
            Write-Host "  → Cerrando proceso: $($_.ProcessName)" -ForegroundColor Yellow
            Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        }
        
        # Eliminar carpeta
        try {
            Remove-Item -Path $path -Recurse -Force
            Write-Host "  ✅ Eliminado correctamente" -ForegroundColor Green
        } catch {
            Write-Host "  ❌ Error al eliminar: $_" -ForegroundColor Red
        }
    }
}

if (-not $found) {
    Write-Host "ℹ️  No se encontraron carpetas de instalación" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "🔍 Buscando accesos directos..." -ForegroundColor Yellow

# Eliminar acceso directo del escritorio
$desktopShortcut = "$env:PUBLIC\Desktop\FVX Showroom.lnk"
if (Test-Path $desktopShortcut) {
    Remove-Item $desktopShortcut -Force
    Write-Host "✅ Eliminado: Acceso directo del Escritorio" -ForegroundColor Green
} else {
    $userDesktopShortcut = "$env:USERPROFILE\Desktop\FVX Showroom.lnk"
    if (Test-Path $userDesktopShortcut) {
        Remove-Item $userDesktopShortcut -Force
        Write-Host "✅ Eliminado: Acceso directo del Escritorio (usuario)" -ForegroundColor Green
    }
}

# Eliminar del menú inicio
$startMenuPaths = @(
    "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\FVX Showroom",
    "$env:ProgramData\Microsoft\Windows\Start Menu\Programs\FVX Showroom"
)

foreach ($path in $startMenuPaths) {
    if (Test-Path $path) {
        Remove-Item -Path $path -Recurse -Force
        Write-Host "✅ Eliminado: Menú Inicio - $path" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "🗂️  Datos de la aplicación (NO se eliminarán):" -ForegroundColor Cyan
Write-Host "   → $env:APPDATA\fvx-showroom-web" -ForegroundColor Gray
Write-Host "   (Tus pantallas y configuración se mantendrán)" -ForegroundColor Gray

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "✅ Desinstalación completada" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Compila el nuevo instalador: npm run build-electron" -ForegroundColor White
Write-Host "2. Instala desde: release\FVX Showroom Setup 1.0.0.exe" -ForegroundColor White
Write-Host ""

# Pausar para que el usuario vea el resultado
Read-Host "Presiona Enter para cerrar"

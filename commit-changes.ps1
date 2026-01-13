# Script para hacer commit de los cambios
Set-Location "C:\Users\Public"

Write-Host "Agregando archivos..." -ForegroundColor Cyan
git add .

Write-Host "`nCreando commit..." -ForegroundColor Cyan
git commit -m "Add: imagenes profesionales Unsplash en todos los templates y landing pages"

Write-Host "`nSubiendo a GitHub..." -ForegroundColor Cyan
git push origin main

Write-Host "`nCompleto!" -ForegroundColor Green
Write-Host "Revisa los cambios en: https://dsd228.github.io/amazon-product-page/" -ForegroundColor Yellow

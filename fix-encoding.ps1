# Script para corregir caracteres UTF-8 mal codificados

Set-Location "C:\Users\Public"

# Lista de reemplazos
$fixes = @(
    @('ðŸ"', '🔍'),
    @('ðŸ›', '🛒'),
    @('ðŸŽ¨', '🎨'),
    @('ðŸ"±', '📱'),
    @('ðŸ"Š', '📊'),
    @('âœ¨', '✨'),
    @('ðŸŽ¯', '🎯'),
    @('â˜€ï¸', '☀️'),
    @('âŒš', '⌚'),
    @('ðŸ'Ÿ', '👟'),
    @('ðŸ–¥ï¸', '🖥️'),
    @('â˜…', '★'),
    @('âœ"', '✓'),
    @('ðŸ"š', '📚'),
    @('ðŸŒ¿', '🌿'),
    @('ðŸ'™', '💙'),
    @('ðŸ"¥', '🔥'),
    @('âš«', '⚫'),
    @('ðŸ'Ž', '💎'),
    @('EnergÃ­a', 'Energía'),
    @('DiseÃ±o', 'Diseño'),
    @('ConversiÃ³n', 'Conversión'),
    @('tecnologÃ­a', 'tecnología'),
    @('energÃ­a', 'energía'),
    @('electrÃ³nica', 'electrónica'),
    @('garantÃ­a', 'garantía'),
    @('baterÃ­a', 'batería'),
    @('cardÃ­aco', 'cardíaco'),
    @('dÃ­as', 'días'),
    @('aÃ±os', 'años'),
    @('reseÃ±as', 'reseñas'),
    @('precisiÃ³n', 'precisión'),
    @('calificaciÃ³n', 'calificación'),
    @('DocumentaciÃ³n', 'Documentación'),
    @('GuÃ­a', 'Guía'),
    @('TecnologÃ­a', 'Tecnología')
)

# Procesar archivos HTML
$files = Get-ChildItem -Filter "*.html" -Recurse -File
$totalFixed = 0

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $original = $content
    
    foreach ($fix in $fixes) {
        $content = $content.Replace($fix[0], $fix[1])
    }
    
    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        $totalFixed++
        Write-Host "Fixed: $($file.Name)"
    }
}

Write-Host "`nTotal archivos corregidos: $totalFixed"

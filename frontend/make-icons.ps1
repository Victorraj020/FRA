Add-Type -AssemblyName System.Drawing

function Make-PWAIcon($size, $outPath) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias

    $bg = [System.Drawing.Color]::FromArgb(255, 10, 22, 40)
    $g.Clear($bg)

    $circleColor = [System.Drawing.Color]::FromArgb(255, 22, 101, 52)
    $brush = New-Object System.Drawing.SolidBrush($circleColor)
    $margin = [int]($size * 0.1)
    $g.FillEllipse($brush, $margin, $margin, ($size - 2*$margin), ($size - 2*$margin))

    $ringPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(80, 255, 255, 255), [float]($size * 0.02))
    $innerM = [int]($size * 0.15)
    $g.DrawEllipse($ringPen, $innerM, $innerM, ($size - 2*$innerM), ($size - 2*$innerM))

    $fontSize = [float]($size * 0.26)
    $font = New-Object System.Drawing.Font("Arial", $fontSize, [System.Drawing.FontStyle]::Bold)
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
    $rect = New-Object System.Drawing.RectangleF(0.0, [float](-$size*0.04), [float]$size, [float]$size)
    $g.DrawString("FRA", $font, $textBrush, $rect, $sf)

    $fontSize2 = [float]($size * 0.1)
    $font2 = New-Object System.Drawing.Font("Arial", $fontSize2)
    $subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 200, 230, 200))
    $rect2 = New-Object System.Drawing.RectangleF(0.0, [float]($size * 0.3), [float]$size, [float]$size)
    $g.DrawString("Portal", $font2, $subBrush, $rect2, $sf)

    $g.Dispose()
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Created: $outPath"
}

Make-PWAIcon 192 "C:\win_m-indicator-ai-hackathon\frontend\public\pwa-192.png"
Make-PWAIcon 512 "C:\win_m-indicator-ai-hackathon\frontend\public\pwa-512.png"
Write-Host "All icons created successfully!"

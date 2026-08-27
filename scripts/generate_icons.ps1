Add-Type -AssemblyName System.Drawing

function Generate-PointsVaultIcon {
    param(
        [int]$Size,
        [string]$OutPath
    )

    $bmp = New-Object System.Drawing.Bitmap($Size, $Size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # Background gradient
    $rect = New-Object System.Drawing.Rectangle(0, 0, $Size, $Size)
    $cTop = [System.Drawing.ColorTranslator]::FromHtml('#4338ca')
    $cBot = [System.Drawing.ColorTranslator]::FromHtml('#090d16')
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $cTop, $cBot, 45.0)
    $g.FillRectangle($brush, $rect)

    # Inner circular shield
    $shieldSize = [int]($Size * 0.82)
    $pad = [int](($Size - $shieldSize) / 2)
    $shieldRect = New-Object System.Drawing.Rectangle($pad, $pad, $shieldSize, $shieldSize)
    $sTop = [System.Drawing.ColorTranslator]::FromHtml('#7c3aed')
    $sBot = [System.Drawing.ColorTranslator]::FromHtml('#1e1b4b')
    $sBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($shieldRect, $sTop, $sBot, 135.0)
    $g.FillEllipse($sBrush, $shieldRect)

    # Border around shield
    $penColor = [System.Drawing.ColorTranslator]::FromHtml('#a78bfa')
    $penWidth = [float]($Size * 0.02)
    $pen = New-Object System.Drawing.Pen($penColor, $penWidth)
    $g.DrawEllipse($pen, $shieldRect)

    # Monogram PV
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $fontSize = [float]($Size * 0.36)
    $font = New-Object System.Drawing.Font('Arial', $fontSize, [System.Drawing.FontStyle]::Bold)
    
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center

    $textRect = New-Object System.Drawing.RectangleF(0.0, [float]($Size * 0.02), [float]$Size, [float]($Size * 0.96))
    $g.DrawString('PV', $font, $textBrush, $textRect, $sf)

    $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $pen.Dispose()
    $font.Dispose()
    $textBrush.Dispose()
    $sBrush.Dispose()
    $brush.Dispose()
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Generated $OutPath ($Size x $Size)"
}

Generate-PointsVaultIcon -Size 192 -OutPath "public\icon-192.png"
Generate-PointsVaultIcon -Size 512 -OutPath "public\icon-512.png"
Generate-PointsVaultIcon -Size 512 -OutPath "public\icon-512-maskable.png"

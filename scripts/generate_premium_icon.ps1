Add-Type -AssemblyName System.Drawing

function Generate-LuxuryAppIcon {
    param(
        [int]$Size = 512,
        [string]$OutPath = "public\icon-512.png"
    )

    $bmp = New-Object System.Drawing.Bitmap($Size, $Size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # 1. Dark Premium Midnight Background with subtle rounded corners
    $bgRect = New-Object System.Drawing.Rectangle(0, 0, $Size, $Size)
    $cTop = [System.Drawing.ColorTranslator]::FromHtml('#0f172a')
    $cBot = [System.Drawing.ColorTranslator]::FromHtml('#020617')
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($bgRect, $cTop, $cBot, 90.0)
    $g.FillRectangle($bgBrush, $bgRect)

    # 2. Ambient Radial Glow
    $glowRect = New-Object System.Drawing.Rectangle([int]($Size * 0.1), [int]($Size * 0.1), [int]($Size * 0.8), [int]($Size * 0.8))
    $pathGlow = New-Object System.Drawing.Drawing2D.GraphicsPath
    $pathGlow.AddEllipse($glowRect)
    $pgh = New-Object System.Drawing.Drawing2D.PathGradientBrush($pathGlow)
    $pgh.CenterColor = [System.Drawing.Color]::FromArgb(160, 99, 102, 241) # Indigo glow
    $pgh.SurroundColors = [System.Drawing.Color[]]@([System.Drawing.Color]::FromArgb(0, 2, 6, 23))
    $g.FillPath($pgh, $pathGlow)

    # 3. Outer Glowing Shield Base
    $shieldPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $p1 = New-Object System.Drawing.PointF([float]($Size * 0.5), [float]($Size * 0.12))
    $p2 = New-Object System.Drawing.PointF([float]($Size * 0.84), [float]($Size * 0.28))
    $p3 = New-Object System.Drawing.PointF([float]($Size * 0.84), [float]($Size * 0.65))
    $p4 = New-Object System.Drawing.PointF([float]($Size * 0.5), [float]($Size * 0.88))
    $p5 = New-Object System.Drawing.PointF([float]($Size * 0.16), [float]($Size * 0.65))
    $p6 = New-Object System.Drawing.PointF([float]($Size * 0.16), [float]($Size * 0.28))
    $shieldPts = [System.Drawing.PointF[]]@($p1, $p2, $p3, $p4, $p5, $p6)
    $shieldPath.AddPolygon($shieldPts)

    $shieldGrad = New-Object System.Drawing.Drawing2D.LinearGradientBrush($bgRect, [System.Drawing.ColorTranslator]::FromHtml('#4f46e5'), [System.Drawing.ColorTranslator]::FromHtml('#1e1b4b'), 45.0)
    $g.FillPath($shieldGrad, $shieldPath)

    $shieldPen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml('#c084fc'), [float]($Size * 0.024))
    $g.DrawPath($shieldPen, $shieldPath)

    # 4. Stylized Floating Metallic Credit Card (Angle)
    $cardPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $cardW = [float]($Size * 0.46)
    $cardH = [float]($Size * 0.29)
    $cardX = [float]($Size * 0.27)
    $cardY = [float]($Size * 0.36)
    $cardRect = New-Object System.Drawing.RectangleF($cardX, $cardY, $cardW, $cardH)
    
    $r = [float]($Size * 0.04)
    $cardPath.AddArc($cardRect.X, $cardRect.Y, $r*2, $r*2, 180, 90)
    $cardPath.AddArc($cardRect.Right - $r*2, $cardRect.Y, $r*2, $r*2, 270, 90)
    $cardPath.AddArc($cardRect.Right - $r*2, $cardRect.Bottom - $r*2, $r*2, $r*2, 0, 90)
    $cardPath.AddArc($cardRect.X, $cardRect.Bottom - $r*2, $r*2, $r*2, 90, 90)
    $cardPath.CloseFigure()

    $cardGrad = New-Object System.Drawing.Drawing2D.LinearGradientBrush($bgRect, [System.Drawing.ColorTranslator]::FromHtml('#f59e0b'), [System.Drawing.ColorTranslator]::FromHtml('#b45309'), 135.0) # Gold card
    $g.FillPath($cardGrad, $cardPath)

    $cardPen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml('#fef08a'), [float]($Size * 0.014))
    $g.DrawPath($cardPen, $cardPath)

    # EMV Chip on Card
    $chipX = [float]($cardX + $cardW * 0.14)
    $chipY = [float]($cardY + $cardH * 0.3)
    $chipW = [float]($cardW * 0.22)
    $chipH = [float]($cardH * 0.38)
    $chipBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#fef9c3'))
    $g.FillRectangle($chipBrush, $chipX, $chipY, $chipW, $chipH)

    # 5. Sparkling Diamond Star (Rewards Points)
    $starPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $starCX = [float]($Size * 0.65)
    $starCY = [float]($Size * 0.34)
    $sRadius = [float]($Size * 0.13)
    $sp1 = New-Object System.Drawing.PointF($starCX, [float]($starCY - $sRadius))
    $sp2 = New-Object System.Drawing.PointF([float]($starCX + $sRadius * 0.25), [float]($starCY - $sRadius * 0.25))
    $sp3 = New-Object System.Drawing.PointF([float]($starCX + $sRadius), $starCY)
    $sp4 = New-Object System.Drawing.PointF([float]($starCX + $sRadius * 0.25), [float]($starCY + $sRadius * 0.25))
    $sp5 = New-Object System.Drawing.PointF($starCX, [float]($starCY + $sRadius))
    $sp6 = New-Object System.Drawing.PointF([float]($starCX - $sRadius * 0.25), [float]($starCY + $sRadius * 0.25))
    $sp7 = New-Object System.Drawing.PointF([float]($starCX - $sRadius), $starCY)
    $sp8 = New-Object System.Drawing.PointF([float]($starCX - $sRadius * 0.25), [float]($starCY - $sRadius * 0.25))
    $starPts = [System.Drawing.PointF[]]@($sp1, $sp2, $sp3, $sp4, $sp5, $sp6, $sp7, $sp8)
    $starPath.AddPolygon($starPts)

    $starBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($bgRect, [System.Drawing.ColorTranslator]::FromHtml('#38bdf8'), [System.Drawing.ColorTranslator]::FromHtml('#ffffff'), 45.0)
    $g.FillPath($starBrush, $starPath)

    # 6. Save in all required formats
    $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Save("public\icon-512-maskable.png", [System.Drawing.Imaging.ImageFormat]::Png)
    
    $bmp192 = New-Object System.Drawing.Bitmap($bmp, 192, 192)
    $bmp192.Save("public\icon-192.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp192.Dispose()

    $bmp.Dispose()
    $g.Dispose()
    Write-Host "Luxury Icon generated successfully at $OutPath"
}

Generate-LuxuryAppIcon -Size 512 -OutPath "public\icon-512.png"

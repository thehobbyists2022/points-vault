Add-Type -AssemblyName System.Drawing

function Generate-LuxuryFeatureGraphic {
    param(
        [string]$OutPath = "public\feature-graphic.png"
    )

    $width = 1024
    $height = 500
    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # 1. Dark Premium Midnight Background with subtle mesh gradient
    $rect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
    $c1 = [System.Drawing.ColorTranslator]::FromHtml('#0b0f19')
    $c2 = [System.Drawing.ColorTranslator]::FromHtml('#020617')
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c2, 90.0)
    $g.FillRectangle($bgBrush, $rect)

    # Ambient Glow Orbs
    $glow1 = New-Object System.Drawing.Rectangle(-80, -80, 500, 500)
    $path1 = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path1.AddEllipse($glow1)
    $pgh1 = New-Object System.Drawing.Drawing2D.PathGradientBrush($path1)
    $pgh1.CenterColor = [System.Drawing.Color]::FromArgb(100, 99, 102, 241) # Indigo glow
    $pgh1.SurroundColors = [System.Drawing.Color[]]@([System.Drawing.Color]::FromArgb(0, 2, 6, 23))
    $g.FillPath($pgh1, $path1)

    $glow2 = New-Object System.Drawing.Rectangle(650, 150, 450, 450)
    $path2 = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path2.AddEllipse($glow2)
    $pgh2 = New-Object System.Drawing.Drawing2D.PathGradientBrush($path2)
    $pgh2.CenterColor = [System.Drawing.Color]::FromArgb(80, 168, 85, 247) # Purple glow
    $pgh2.SurroundColors = [System.Drawing.Color[]]@([System.Drawing.Color]::FromArgb(0, 2, 6, 23))
    $g.FillPath($pgh2, $path2)

    # 2. Draw Luxury Emblem on the Left Side
    $emblemCX = 200.0
    $emblemCY = 250.0
    $emblemSize = 320.0

    # Shield polygon
    $shieldPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $p1 = New-Object System.Drawing.PointF([float]($emblemCX), [float]($emblemCY - $emblemSize * 0.44))
    $p2 = New-Object System.Drawing.PointF([float]($emblemCX + $emblemSize * 0.38), [float]($emblemCY - $emblemSize * 0.24))
    $p3 = New-Object System.Drawing.PointF([float]($emblemCX + $emblemSize * 0.38), [float]($emblemCY + $emblemSize * 0.18))
    $p4 = New-Object System.Drawing.PointF([float]($emblemCX), [float]($emblemCY + $emblemSize * 0.44))
    $p5 = New-Object System.Drawing.PointF([float]($emblemCX - $emblemSize * 0.38), [float]($emblemCY + $emblemSize * 0.18))
    $p6 = New-Object System.Drawing.PointF([float]($emblemCX - $emblemSize * 0.38), [float]($emblemCY - $emblemSize * 0.24))
    $shieldPts = [System.Drawing.PointF[]]@($p1, $p2, $p3, $p4, $p5, $p6)
    $shieldPath.AddPolygon($shieldPts)

    $shieldGrad = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, [System.Drawing.ColorTranslator]::FromHtml('#4f46e5'), [System.Drawing.ColorTranslator]::FromHtml('#1e1b4b'), 45.0)
    $g.FillPath($shieldGrad, $shieldPath)

    $shieldPen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml('#c084fc'), 6.0)
    $g.DrawPath($shieldPen, $shieldPath)

    # Gold Card inside shield
    $cardPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $cardW = 150.0
    $cardH = 95.0
    $cardX = [float]($emblemCX - $cardW * 0.5)
    $cardY = [float]($emblemCY - $cardH * 0.42)
    $cardRect = New-Object System.Drawing.RectangleF($cardX, $cardY, $cardW, $cardH)
    
    $r = 12.0
    $cardPath.AddArc($cardRect.X, $cardRect.Y, $r*2, $r*2, 180, 90)
    $cardPath.AddArc($cardRect.Right - $r*2, $cardRect.Y, $r*2, $r*2, 270, 90)
    $cardPath.AddArc($cardRect.Right - $r*2, $cardRect.Bottom - $r*2, $r*2, $r*2, 0, 90)
    $cardPath.AddArc($cardRect.X, $cardRect.Bottom - $r*2, $r*2, $r*2, 90, 90)
    $cardPath.CloseFigure()

    $cardGrad = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, [System.Drawing.ColorTranslator]::FromHtml('#f59e0b'), [System.Drawing.ColorTranslator]::FromHtml('#b45309'), 135.0)
    $g.FillPath($cardGrad, $cardPath)

    $cardPen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml('#fef08a'), 3.0)
    $g.DrawPath($cardPen, $cardPath)

    # EMV Chip on Gold Card
    $chipBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#fef9c3'))
    $g.FillRectangle($chipBrush, [float]($cardX + 22.0), [float]($cardY + 28.0), 32.0, 36.0)

    # Diamond Gem on top right of shield
    $starPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $starCX = [float]($emblemCX + 55.0)
    $starCY = [float]($emblemCY - 40.0)
    $sRadius = 42.0
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

    $starBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, [System.Drawing.ColorTranslator]::FromHtml('#38bdf8'), [System.Drawing.ColorTranslator]::FromHtml('#ffffff'), 45.0)
    $g.FillPath($starBrush, $starPath)

    # 3. Typography on Right Side
    $fontFamily = New-Object System.Drawing.FontFamily('Arial')
    
    # PointsVault Title
    $titleFont = New-Object System.Drawing.Font($fontFamily, 56.0, [System.Drawing.FontStyle]::Bold)
    $titleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.DrawString('PointsVault', $titleFont, $titleBrush, 390.0, 135.0)

    # Tagline
    $tagFont = New-Object System.Drawing.Font($fontFamily, 22.0, [System.Drawing.FontStyle]::Bold)
    $tagBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#38bdf8'))
    $g.DrawString('Points, Miles & Credit Card Rewards Hub', $tagFont, $tagBrush, 395.0, 220.0)

    # Feature List
    $subFont = New-Object System.Drawing.Font($fontFamily, 16.0, [System.Drawing.FontStyle]::Regular)
    $subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#94a3b8'))
    $g.DrawString('• 5/24 Rule Radar  •  MSR Spending Countdown  •  Custom CPP Valuation', $subFont, $subBrush, 395.0, 272.0)
    $g.DrawString('• Airline & Hotel Loyalty  •  P1 / P2 Household Mode  •  100% Private', $subFont, $subBrush, 395.0, 305.0)

    # Clean up & Save
    $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    $g.Dispose()
    Write-Host "Generated Luxury Feature Graphic at $OutPath ($width x $height)"
}

Generate-LuxuryFeatureGraphic

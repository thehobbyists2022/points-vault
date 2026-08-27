Add-Type -AssemblyName System.Drawing

function Generate-FeatureGraphic {
    param(
        [string]$OutPath = "public\feature-graphic.png"
    )

    $width = 1024
    $height = 500
    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # Background gradient
    $rect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
    $c1 = [System.Drawing.ColorTranslator]::FromHtml('#0f172a')
    $c2 = [System.Drawing.ColorTranslator]::FromHtml('#090d16')
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c2, 45.0)
    $g.FillRectangle($bgBrush, $rect)

    # Accent glow circles in background
    $glow1 = New-Object System.Drawing.Rectangle(-50, -50, 400, 400)
    $gBrush1 = New-Object System.Drawing.Drawing2D.LinearGradientBrush($glow1, [System.Drawing.Color]::FromArgb(40, 99, 102, 241), [System.Drawing.Color]::Transparent, 45.0)
    $g.FillEllipse($gBrush1, $glow1)

    $glow2 = New-Object System.Drawing.Rectangle(700, 200, 400, 400)
    $gBrush2 = New-Object System.Drawing.Drawing2D.LinearGradientBrush($glow2, [System.Drawing.Color]::FromArgb(35, 168, 85, 247), [System.Drawing.Color]::Transparent, 135.0)
    $g.FillEllipse($gBrush2, $glow2)

    # Shield Badge on Left
    $shieldSize = 220
    $shieldX = 90
    $shieldY = 140
    $shieldRect = New-Object System.Drawing.Rectangle($shieldX, $shieldY, $shieldSize, $shieldSize)
    $sTop = [System.Drawing.ColorTranslator]::FromHtml('#4f46e5')
    $sBot = [System.Drawing.ColorTranslator]::FromHtml('#7c3aed')
    $sBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($shieldRect, $sTop, $sBot, 135.0)
    $g.FillEllipse($sBrush, $shieldRect)

    $pen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml('#c084fc'), 5.0)
    $g.DrawEllipse($pen, $shieldRect)

    # Shield Text PV
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $fontFamily = New-Object System.Drawing.FontFamily('Arial')
    $pvFont = New-Object System.Drawing.Font($fontFamily, 80.0, [System.Drawing.FontStyle]::Bold)
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
    $pvRect = New-Object System.Drawing.RectangleF([float]$shieldX, [float]$shieldY, [float]$shieldSize, [float]$shieldSize)
    $g.DrawString('PV', $pvFont, $textBrush, $pvRect, $sf)

    # App Title
    $titleFont = New-Object System.Drawing.Font($fontFamily, 54.0, [System.Drawing.FontStyle]::Bold)
    $titleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.DrawString('PointsVault', $titleFont, $titleBrush, 360.0, 145.0)

    # Tagline
    $tagFont = New-Object System.Drawing.Font($fontFamily, 22.0, [System.Drawing.FontStyle]::Bold)
    $tagBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#38bdf8'))
    $g.DrawString('Points, Miles & Credit Card Rewards Hub', $tagFont, $tagBrush, 365.0, 225.0)

    # Sub-features pills
    $subFont = New-Object System.Drawing.Font($fontFamily, 16.0, [System.Drawing.FontStyle]::Regular)
    $subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#94a3b8'))
    $g.DrawString('5/24 Tracker  •  MSR Deadlines  •  CPP Valuation  •  P1/P2 Dual Mode', $subFont, $subBrush, 365.0, 275.0)

    # Save
    $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Generated $OutPath ($width x $height)"
}

Generate-FeatureGraphic

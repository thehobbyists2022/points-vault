$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$baseUrl = "https://points-vault-app.pages.dev"
$outDir = "public\screenshots"

if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

$devices = @(
    @{ Name = "screenshot-1-dashboard.png"; Url = "$baseUrl" },
    @{ Name = "screenshot-2-cards.png"; Url = "$baseUrl" },
    @{ Name = "screenshot-3-524rules.png"; Url = "$baseUrl" },
    @{ Name = "screenshot-4-transfer.png"; Url = "$baseUrl" }
)

# Start local test or directly capture URL with chrome headless
& "$chromePath" --headless --disable-gpu --screenshot="$outDir\screenshot-1-dashboard.png" --window-size=1080,1920 --force-device-scale-factor=1 --hide-scrollbars "$baseUrl"

Write-Host "Captured screenshot 1"

# deploy/make-zip.ps1 — package dist\seguro.com.py for Hostinger public_html.
#
# There is no zip binary on this machine, so the archive is built with
# .NET System.IO.Compression. Files land FLAT at the zip root: unzipping the
# archive inside public_html puts index.html at the document root, not inside
# a seguro.com.py\ folder.
#
# Usage: powershell -File deploy\make-zip.ps1 [-Site seguro]

[CmdletBinding()]
param(
    [string]$Site = 'seguro',
    [string]$Domain = 'seguro.com.py'
)

$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$repoRoot = Split-Path -Parent $PSScriptRoot
$source   = Join-Path $repoRoot "dist\$Domain"

if (-not (Test-Path $source)) {
    throw "Nothing to package: $source does not exist. Run: node engine/build-site.mjs --site=$Site"
}

$stamp   = Get-Date -Format 'yyyy-MM-dd'
$zipName = "$($Domain.Replace('.', '-'))-$stamp.zip"
$zipPath = Join-Path (Join-Path $repoRoot 'dist') $zipName

if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

# Refuse to ship anything that must never leave the repository.
# The contact form needs exactly three PHP files; config.php and storage/ are never packaged.
$allowedPhp = @('contacto-alianzas.php', 'contacto-lib.php', 'index.php')
$forbidden = Get-ChildItem -Path $source -Recurse -File -Force |
    Where-Object {
        ($_.Extension -eq '.php' -and $allowedPhp -notcontains $_.Name) -or
        $_.Extension -in '.log', '.mjs', '.md' -or
        $_.Name -in 'config.php', 'vendercrm-config.php' -or
        $_.FullName -match '[\/]storage[\/]'
    }
if ($forbidden) {
    throw "Refusing to package: forbidden files found in the output -> $($forbidden.Name -join ', ')"
}

$sourceFull = (Resolve-Path $source).Path.TrimEnd('\')
$files = Get-ChildItem -Path $source -Recurse -File -Force

$archive = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)
try {
    foreach ($file in $files) {
        # Entry name is the path relative to dist\<domain>, with forward slashes,
        # so the archive root IS the document root.
        $entryName = $file.FullName.Substring($sourceFull.Length + 1).Replace('\', '/')
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
            $archive, $file.FullName, $entryName,
            [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
    }
}
finally {
    $archive.Dispose()
}

$size = (Get-Item $zipPath).Length
$htmlCount = ($files | Where-Object { $_.Extension -eq '.html' }).Count

Write-Host "Packaged $($files.Count) files ($htmlCount HTML) from dist\$Domain"
Write-Host "  Archive : $zipPath"
Write-Host ("  Size    : {0:N0} bytes ({1:N2} MB)" -f $size, ($size / 1MB))
Write-Host "  Layout  : flat - unzip directly into public_html"

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path "Eco_Swadesh_Summary_Report.docx"))
$entry = $zip.GetEntry("word/document.xml")
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$content = $reader.ReadToEnd()
$reader.Close()
$stream.Close()
$zip.Dispose()
$clean = [regex]::Replace($content, "<[^>]+>", " ")
$clean = [regex]::Replace($clean, "\s+", " ")
$clean | Out-File -FilePath "scripts/summary_report_text.txt" -Encoding utf8
Write-Output "Extracted $($clean.Length) characters"

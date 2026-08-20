Add-Type -AssemblyName System.IO.Compression.FileSystem

$docxFiles = @("EcoSwadesh_Doc10.docx", "EcoSwadesh_Docs1-5.docx", "EcoSwadesh_Docs6-9.docx", "Eco_Swadesh_Summary_Report.docx")

foreach ($file in $docxFiles) {
    if (Test-Path $file) {
        $zip = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path $file))
        $entry = $zip.GetEntry("word/document.xml")
        $stream = $entry.Open()
        $reader = New-Object System.IO.StreamReader($stream)
        $content = $reader.ReadToEnd()
        $reader.Close()
        $stream.Close()
        $zip.Dispose()
        $clean = [regex]::Replace($content, "<[^>]+>", " ")
        $clean = [regex]::Replace($clean, "\s+", " ")
        $outName = [System.IO.Path]::ChangeExtension($file, ".txt")
        $clean | Out-File -FilePath "scripts/$outName" -Encoding utf8
        Write-Output "Extracted $file -> scripts/$outName ($($clean.Length) chars)"
    }
}

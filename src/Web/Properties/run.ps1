$projectParent = (get-item $PSScriptRoot).Parent
$projectName = $projectParent.Name
$projectPath = $projectParent.FullName

wt -w 0 split-pane --title $projectName -d $projectPath PowerShell -NoExit -Command "Clear-Host"

Set-Location $projectPath
PowerShell -NoExit ./Properties/npmrun.ps1
# Arranca o leitor Steevanz (npm run reader) sempre que este utilizador entra no Windows.
# Uso:  powershell -ExecutionPolicy Bypass -File scripts\reader\install-startup.ps1
# Remover: scripts\reader\uninstall-startup.ps1
$ErrorActionPreference = 'Stop'

$taskName = 'Steevanz leitor de reviews'
$repo = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$npm = (Get-Command npm.cmd -ErrorAction SilentlyContinue).Source
if (-not $npm) { throw 'Não encontrei o npm. Instale o Node.js 24 ou mais recente e tente outra vez.' }

$user = "$env:USERDOMAIN\$env:USERNAME"
# Janela da consola visível (com o registo do leitor); o Edge abre-se ao lado.
$action = New-ScheduledTaskAction -Execute 'cmd.exe' -Argument "/k `"`"$npm`" run reader`"" -WorkingDirectory $repo
$trigger = New-ScheduledTaskTrigger -AtLogOn -User $user
# Sem limite de tempo; volta a tentar se parar; nunca duas cópias ao mesmo tempo.
$settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit ([TimeSpan]::Zero) -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1) -MultipleInstances IgnoreNew -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
$principal = New-ScheduledTaskPrincipal -UserId $user -LogonType Interactive -RunLevel Limited

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description "Leitor de reviews Steevanz ($repo)" -Force | Out-Null
Write-Host "Tarefa '$taskName' criada: o leitor arranca quando $user entrar no Windows."
Write-Host "Para o arrancar já: Start-ScheduledTask -TaskName '$taskName'"

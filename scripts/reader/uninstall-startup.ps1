# Deixa de arrancar o leitor Steevanz ao entrar no Windows (não pára um leitor já aberto).
# Uso:  powershell -ExecutionPolicy Bypass -File scripts\reader\uninstall-startup.ps1
$ErrorActionPreference = 'Stop'

$taskName = 'Steevanz leitor de reviews'
if (Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue) {
  Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
  Write-Host "Tarefa '$taskName' removida."
} else {
  Write-Host "A tarefa '$taskName' não existe; nada a fazer."
}

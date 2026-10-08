import { ActionForm, SubmitButton } from "@/components/backoffice/ActionForm";
import { Panel, adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import { requestOrigin } from "@/lib/booking/request";
import { moduleEstablishments } from "@/lib/establishments/provision";
import { loadBundle } from "@/lib/establishments/store";
import { weekdayNames } from "@/lib/establishments/types";
import { saveWaitlistSettings } from "@/lib/modules/waitlist/actions";
import { currentSettings, loadQueue, loadStats, type WaitlistSettingsRow } from "@/lib/modules/waitlist/store";
import type { ModuleProps } from "../registry";
import { EstablishmentSettings } from "../shared/EstablishmentSettings";
import { Materials } from "../shared/Materials";
import { ModuleNav, pickEstablishment, pickView } from "../shared/ModuleNav";
import { NoEstablishment } from "../shared/NoEstablishment";
import { QueueCounter } from "../counter/QueueCounter";
import { AutoRefresh } from "../shared/AutoRefresh";
import { JoinChime } from "./JoinChime";

const views = [
  { id: "fila", label: "Fila" },
  { id: "estatisticas", label: "Estatísticas" },
  { id: "definicoes", label: "Definições" },
  { id: "materiais", label: "QR e ecrã" },
];

function Tile({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="card flex flex-col gap-1 p-4">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-2xl font-semibold tabular-nums text-text">{value}</span>
      <span className="text-xs text-subtle">{hint}</span>
    </div>
  );
}

function QueueSettings({ settings, establishmentId, hasServices, hasStaff }: { settings: WaitlistSettingsRow; establishmentId: string; hasServices: boolean; hasStaff: boolean }) {
  const input = `${adminInputClasses} h-11`;
  return (
    <Panel title="Regras da fila">
      <ActionForm key={settings.updated_at} action={saveWaitlistSettings} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input type="hidden" name="establishment_id" value={establishmentId} />
        <label className={adminLabelClasses}>
          Minutos por vez (média)
          <input name="avg_minutes" type="number" min={1} max={240} required defaultValue={settings.avg_minutes} className={input} />
          <span className="text-xs font-normal text-subtle">Tempo médio entre duas chamadas. A estimativa ajusta-se ao ritmo real do dia.</span>
        </label>
        <label className={adminLabelClasses}>
          Minutos até a chamada fechar
          <input name="grace_minutes" type="number" min={1} max={120} required defaultValue={settings.grace_minutes} className={input} />
          <span className="text-xs font-normal text-subtle">Depois de chamada, a pessoa conta como atendida passado este tempo, sem ninguém marcar nada. «Vou atrasar-me» dá o dobro.</span>
        </label>
        <label className={adminLabelClasses}>
          Máximo à espera
          <input name="max_waiting" type="number" min={1} max={500} required defaultValue={settings.max_waiting} className={input} />
        </label>
        <label className={adminLabelClasses}>
          Máximo de pessoas por grupo
          <input name="max_party" type="number" min={1} max={100} required defaultValue={settings.max_party} className={input} />
        </label>
        <fieldset className="flex flex-col gap-3 sm:col-span-2">
          <legend className="mb-1 text-sm font-medium text-muted">Automático</legend>
          <label className="flex items-start gap-2 text-sm text-text">
            <input type="checkbox" name="auto_hours" defaultChecked={settings.auto_hours} className="mt-0.5 h-4.5 w-4.5 accent-accent" />
            <span>
              Abrir e fechar a fila com o horário
              <span className="block text-xs text-subtle">Abre à hora de abertura e fecha à hora de fecho (horário em «Espaço», abaixo). Pode sempre abrir ou fechar à mão.</span>
            </span>
          </label>
          <label className="flex items-start gap-2 text-sm text-text">
            <input type="checkbox" name="auto_next" defaultChecked={settings.auto_next} className="mt-0.5 h-4.5 w-4.5 accent-accent" />
            <span>
              Chamar logo o seguinte ao marcar «Não apareceu»
              <span className="block text-xs text-subtle">Quando alguém chamado não aparece e marca «Não apareceu», a senha seguinte é chamada sem mais nenhum toque.</span>
            </span>
          </label>
        </fieldset>
        <fieldset className="flex flex-col gap-2 sm:col-span-2">
          <legend className="mb-1 text-sm font-medium text-muted">O que perguntar ao cliente</legend>
          <label className="flex items-center gap-2 text-sm text-text">
            <input type="checkbox" name="ask_party" defaultChecked={settings.ask_party} className="h-4.5 w-4.5 accent-accent" />
            Número de pessoas
          </label>
          <label className="flex items-center gap-2 text-sm text-text">
            <input type="checkbox" name="ask_service" defaultChecked={settings.ask_service} className="h-4.5 w-4.5 accent-accent" />
            Serviço {hasServices ? "" : <span className="text-subtle">(adicione serviços abaixo)</span>}
          </label>
          <label className="flex items-center gap-2 text-sm text-text">
            <input type="checkbox" name="ask_staff" defaultChecked={settings.ask_staff} className="h-4.5 w-4.5 accent-accent" />
            Profissional preferido {hasStaff ? "" : <span className="text-subtle">(adicione profissionais abaixo)</span>}
          </label>
        </fieldset>
        <label className={`${adminLabelClasses} sm:col-span-2`}>
          Mensagem na página de entrada (opcional)
          <textarea name="message" maxLength={300} rows={2} defaultValue={settings.message ?? ""} className={`${adminInputClasses} py-2`} placeholder="Ex.: Mesas de 6 ou mais pessoas: fale com a equipa." />
        </label>
        <div className="sm:col-span-2">
          <SubmitButton size="sm">Guardar</SubmitButton>
        </div>
      </ActionForm>
    </Panel>
  );
}

export async function WaitlistModule({ userId, viewer, basePath, query, productId }: ModuleProps) {
  const establishments = await moduleEstablishments(userId, productId);
  const current = pickEstablishment(establishments, query);
  if (!current) return <NoEstablishment productId={productId} viewer={viewer} ownerId={userId} />;
  const view = pickView(query, views);
  const bundle = await loadBundle(current);
  const settings = await currentSettings(current, bundle);
  const nav = <ModuleNav basePath={basePath} establishments={establishments} current={current} views={views} view={view} />;

  if (view === "estatisticas") {
    const stats = await loadStats(current);
    const left = stats.noShow + stats.cancelled;
    return (
      <div className="flex flex-col gap-6">
        {nav}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Tile label="Entraram na fila" value={String(stats.joined)} hint={`Últimos ${stats.days} dias.`} />
          <Tile label="Atendidos" value={String(stats.served)} hint="Fechados pela equipa ou automaticamente, depois de chamados." />
          <Tile
            label="Desistências"
            value={String(left)}
            hint={`${stats.cancelled} desistiram · ${stats.noShow} não apareceram depois de chamados.`}
          />
          <Tile
            label="Espera mediana"
            value={stats.medianWait === null ? "–" : `${stats.medianWait} min`}
            hint="Da entrada na fila até ser chamado (metade espera menos, metade mais)."
          />
        </div>
        <Panel title="Horas com mais gente">
          {stats.byHour.length ? (
            <ol className="flex flex-col divide-y divide-line">
              {stats.byHour.slice(0, 6).map((slot) => (
                <li key={`${slot.weekday}-${slot.hour}`} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-text">
                    {weekdayNames[slot.weekday]}, {String(slot.hour).padStart(2, "0")}:00–{String(slot.hour + 1).padStart(2, "0")}:00
                  </span>
                  <span className="tabular-nums text-muted">{slot.count} entradas</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-muted">Ainda sem dados. Aparecem assim que a fila começar a ser usada.</p>
          )}
          <p className="mt-3 text-xs text-subtle">Contagem de entradas na fila por dia da semana e hora, nos últimos {stats.days} dias.</p>
        </Panel>
      </div>
    );
  }

  if (view === "definicoes") {
    return (
      <div className="flex flex-col gap-6">
        {nav}
        <QueueSettings settings={settings} establishmentId={current.id} hasServices={bundle.services.length > 0} hasStaff={bundle.staff.length > 0} />
        <EstablishmentSettings bundle={bundle} viewer={viewer} sections={["details", "services", "staff"]} />
      </div>
    );
  }

  if (view === "materiais") {
    const origin = await requestOrigin();
    const url = `${origin}/fila/${current.slug}`;
    return (
      <div className="flex flex-col gap-6">
        {nav}
        <Materials
          title="Página da fila"
          url={url}
          hint="Este é o link da fila. Imprima o cartaz para a entrada, ou peça-nos a placa NFC já programada com este link."
          poster={{
            heading: current.kind === "restaurant" ? "Mesa ocupada? Entre na fila." : "Entre na fila pelo telemóvel.",
            sub: "Aponte a câmara ao código. Avisamos quando for a sua vez — pode esperar onde quiser.",
            name: current.name,
          }}
          extra={
            <div className="mt-5 flex flex-col gap-1 border-t border-line pt-4 text-sm">
              <span className="font-semibold text-text">Ecrã de chamada</span>
              <span className="text-muted">
                Abra numa televisão ou monitor junto à entrada: mostra os números chamados e os próximos.{" "}
                <a href={`${url}/ecra`} target="_blank" rel="noopener" className="font-semibold text-accent-text hover:underline">
                  Abrir ecrã de chamada
                </a>
              </span>
            </div>
          }
        />
      </div>
    );
  }

  const queue = await loadQueue(current, settings);
  const newest = queue.live.filter((entry) => entry.status === "waiting").sort((a, b) => Date.parse(b.joined_at) - Date.parse(a.joined_at))[0];
  return (
    <div className="flex flex-col gap-6">
      <AutoRefresh intervalMs={8000} />
      {nav}
      <div className="flex justify-end">
        <JoinChime latest={newest?.id ?? null} />
      </div>
      <QueueCounter bundle={bundle} settings={settings} queue={queue} />
    </div>
  );
}

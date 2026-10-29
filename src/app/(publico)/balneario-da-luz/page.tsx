import type { Metadata } from "next";
import { Panel } from "@/components/backoffice/ui";

// Shareable progress report on the Balneário da Luz project (3D shirt rail, unofficial Benfica tribute).
// Reached only by its link: the (publico) layout keeps it out of search engines and it is not in the sitemap.
export const metadata: Metadata = {
  title: "Balneário da Luz · Ponto de situação",
  description: "Ronda de revisão do Balneário da Luz, comparada com o site do SD Huesca.",
};

const fixes: { title: string; body: string[] }[] = [
  {
    title: "1. Riscos brancos na camisola",
    body: [
      "Corrigido. O modelo original estava limpo: os riscos nasciam quando o tornávamos mais leve. A simplificação fazia a camisola apanhar zonas brancas vizinhas da textura (riscas e letras do patrocinador).",
      "A textura foi refeita por cima da camisola simplificada, a partir do original. Nas camisolas do varão nota-se bem a diferença.",
      "Os modelos ficaram ainda mais leves: 4,0 MB o detalhado e 0,8 MB o do varão (o original tinha 59 MB).",
      "Ficam umas pontinhas brancas na gola, nos ombros, que já vêm do modelo original.",
    ],
  },
  {
    title: "2. Volume",
    body: [
      "A camisola parece ter corpo lá dentro. De lado, a profundidade passou de ~3 % para ~15 % da largura, perto da do Huesca.",
      "As mangas também ficaram arredondadas e o nome e o número continuam colados às costas.",
    ],
  },
  {
    title: "3. Cartão de detalhe",
    body: [
      "Em ecrãs baixos os 4 números ficam numa só linha e a foto encolhe um pouco. Foto, crédito e aviso legal continuam visíveis, sem scroll.",
    ],
  },
  {
    title: "4. Comparação com o Huesca",
    body: [
      "Varão dividido em secções por posição, com rótulos por cima (● DEFESAS 9).",
      "Etiqueta vermelha com o número em cada cabide.",
      "Ao passar o rato, o nome em baixo muda para a camisola apontada.",
      "O nome curvo não foi feito: o Benfica estampa os nomes direitos.",
    ],
  },
  {
    title: "5. Animação de entrada",
    body: [
      "Ecrã de carregamento com a marca e barra de progresso real.",
      "A câmara recua pelo varão, as camisolas chegam em cascata e assentam a balançar, e o resto da página entra no fim.",
      "Tudo pronto em ~2 s. Clique ou tecla salta a entrada; links diretos /numero/N abrem logo na camisola; com «reduzir movimento» não há animação.",
    ],
  },
];

const checks = ["Testado no Chrome, sem erros na consola.", "Build de produção a passar.", "Cartão de detalhe sem scroll a 1024×492."];

const pending = [
  "Os rótulos das secções são pequenos e ficam perto dos filtros em ecrãs baixos.",
  "Mobile testado só numa janela simulada de 390 px; falta experimentar num telemóvel a sério.",
  "9 jogadores sem foto de licença livre: precisam de fotos com direitos de uso.",
  "Os guarda-redes ainda usam o equipamento de campo; falta o modelo do equipamento de guarda-redes.",
];

function List({ items }: { items: string[] }) {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-5 text-muted marker:text-subtle">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function BalnearioReportPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 sm:py-16">
      <div className="flex flex-col gap-2">
        <p className="eyebrow">Steevanz · Ponto de situação</p>
        <h1 className="display text-4xl sm:text-5xl">Balneário da Luz</h1>
        <p className="text-muted">Ronda de revisão e correção, comparada com o site do SD Huesca · 29 de outubro de 2026</p>
      </div>
      <Panel title="Verificação">
        <List items={checks} />
      </Panel>
      <div className="grid gap-6 lg:grid-cols-2">
        {fixes.map((fix) => (
          <Panel key={fix.title} title={fix.title}>
            <List items={fix.body} />
          </Panel>
        ))}
      </div>
      <Panel title="Ainda por ver">
        <List items={pending} />
      </Panel>
      <p className="text-sm text-subtle">Tributo não oficial, não afiliado ao Sport Lisboa e Benfica.</p>
    </main>
  );
}

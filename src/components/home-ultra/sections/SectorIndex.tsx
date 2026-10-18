import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { PlusIcon } from "@/components/icons";
import { photos } from "@/content/media";
import { getProductCopy } from "@/content/product-copy";
import { sectorSlugs } from "@/content/sector-slugs";
import { sectors } from "@/content/sectors";
import { euros, fromLabel, monthlyFeeSuffix, product, productHref } from "@/content/home-ultra/shared";
import {
  sectorIndexCopy as copy,
  sectorIndexProductNames,
  sectorIndexRows,
  type SectorIndexRow,
} from "@/content/home-ultra/sectorIndex";
import type { ProductId } from "@/content/types";
import { TextLink } from "../shared/Buttons";
import { Section, SectionHeading } from "../shared/Section";
import s from "../shared/ultra.module.css";
import st from "./SectorIndex.module.css";

// «Soluções por setor» (#setores): an editorial index of five sectors. Server component, zero JS:
// each row is a <details name="setores"> (one open at a time, the first open on load). The panel height
// animates through ::details-content + interpolate-size where supported and opens instantly elsewhere.
// Rows rise in through RevealRoot (data-hu-reveal="rise", styled in SectorIndex.module.css).

const PHOTO_SIZES = "(min-width: 1024px) 480px, (min-width: 640px) 36rem, 100vw";

function productName(id: ProductId): string {
  return sectorIndexProductNames[id] ?? getProductCopy(id, "pt").name;
}

/** «149 € de configuração + 49 €/mês», read from the sector's pack in sectors.ts. */
function packValue(row: SectorIndexRow): string | null {
  if (!row.showPack) return null;
  const pack = sectors.find((sector) => sector.id === row.sector)?.pack;
  if (!pack) return null;
  return copy.packValue.replace("{setup}", euros(pack.setup)).replace("{monthly}", euros(pack.monthly));
}

function Row({ row, index }: { row: SectorIndexRow; index: number }) {
  const photo = photos[row.photo];
  const pack = packValue(row);
  const first = index === 0;
  return (
    <details
      name="setores"
      open={first}
      className={st.row}
      data-hu-reveal="rise"
      style={{ "--row": index } as CSSProperties}
    >
      <summary className={st.summary}>
        <span className={`${s.indexRow} ${st.name}`}>{row.name}</span>
        <span className={st.line}>{row.summary}</span>
        <span className={st.plus} aria-hidden="true">
          <PlusIcon size={20} className={st.plusIcon} />
        </span>
      </summary>

      <div className={st.panel}>
        <div className={st.listCol}>
          <ul className={st.list} aria-label={`Produtos para ${row.name.toLowerCase()}`}>
            {row.productIds.map((id, i) => {
              const p = product(id);
              return (
                <li key={id} className={st.li} style={{ "--i": i } as CSSProperties}>
                  <Link href={productHref(id)} className={st.item}>
                    <span className={st.itemName}>{productName(id)}</span>
                    <span className={st.leader} aria-hidden="true" />
                    <span className={`${s.price} ${st.itemPrice}`}>
                      {fromLabel(p)}
                      {monthlyFeeSuffix(p)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          {pack ? (
            <p className={st.pack}>
              <span className={st.packLabel}>{copy.packLabel}</span>{" "}
              <span className={s.price}>{pack}</span>
            </p>
          ) : null}
          <TextLink href={`/setores/${sectorSlugs[row.sector].pt}`} className={st.link}>
            {row.link}
          </TextLink>
        </div>

        <div
          className={st.photoWrap}
          data-hu-reveal={first ? "clip" : undefined}
          style={first ? ({ "--hu-clip-from": "inset(12% 6% round 1.25rem)" } as CSSProperties) : undefined}
        >
          <div className={st.photo}>
            <Image src={photo.src} alt={photo.alt.pt} fill sizes={PHOTO_SIZES} className={st.img} />
          </div>
        </div>
      </div>
    </details>
  );
}

export function SectorIndex() {
  return (
    <Section id="setores" labelledBy="setores-title" className={st.section}>
      <SectionHeading id="setores-title" title={copy.title} lead={copy.lead} />
      <div className={st.index}>
        {sectorIndexRows.map((row, index) => (
          <Row key={row.sector} row={row} index={index} />
        ))}
      </div>
      <p className={`${s.subtle} ${st.vat}`}>{copy.vatNote}</p>
    </Section>
  );
}

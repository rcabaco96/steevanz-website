import Image from "next/image";
import { ArrowRight, Check, GlobeIcon, MailIcon, PhoneIcon, TapWaves, WhatsAppIcon } from "@/components/icons";
import { businessCardLabels } from "@/content/business-cards";
import { cardSceneCopy } from "@/content/tap-scenes";
import { localize, type Locale } from "@/lib/i18n";
import styles from "./CardTapScene.module.css";

function Phone({ idle, children }: { idle: string; children: React.ReactNode }) {
  return (
    <div className={styles.phone}>
      <div className={styles.screen}>
        <span className={styles.notch} />
        <div className={styles.idle}>
          <TapWaves className={styles.idleIcon} />
          <span>{idle}</span>
        </div>
        <div className={styles.page}>{children}</div>
      </div>
    </div>
  );
}

/**
 * The «Cartão de visita digital» hero: the Steevanz example card (the owner's own design, QR to /c/rogerio-cabaco, in
 * public/media/business-card), a phone taps it and Rogério Cabaço's contact page opens, «Guardar contacto» pressed.
 */
export function BusinessCardScene({ locale }: { locale: Locale }) {
  const t = localize(cardSceneCopy, locale);
  const labels = localize(businessCardLabels, locale);
  return (
    <div className={styles.scene} role="img" aria-label={t.cardAria}>
      <div className={styles.halo} />
      <div className={styles.ring} />
      <div className={styles.object}>
        <Image src="/media/business-card/steevanz-front.webp" alt="" width={720} height={451} sizes="(min-width: 1024px) 16rem, 50vw" className={styles.cardFront} />
        <Image src="/media/business-card/steevanz-back.webp" alt="" width={720} height={451} sizes="(min-width: 1024px) 18rem, 56vw" priority className={styles.cardBack} />
        <span className={styles.pulse} />
        <span className={`${styles.pulse} ${styles.pulseLate}`} />
      </div>
      <Phone idle={t.idle}>
        <div className={styles.header}>
          <span className={styles.headerMark}>
            S<span>.</span>
          </span>
        </div>
        <Image src="/assinatura/foto.png" alt="" width={180} height={180} sizes="5rem" className={styles.photo} />
        <p className={styles.name}>Rogério Cabaço</p>
        <p className={styles.role}>CEO &amp; Founder · Steevanz</p>
        <span className={styles.save}>{labels.save}</span>
        <div className={styles.tiles}>
          {[
            { icon: <PhoneIcon />, label: labels.call },
            { icon: <WhatsAppIcon />, label: labels.whatsapp },
            { icon: <MailIcon />, label: labels.email },
            { icon: <GlobeIcon />, label: labels.website },
          ].map((tile) => (
            <span key={tile.label} className={styles.tile}>
              <span className={styles.tileIcon}>{tile.icon}</span>
              {tile.label}
            </span>
          ))}
        </div>
      </Phone>
      <div className={`${styles.chip} ${styles.chipTopLeft}`}>
        <TapWaves className={styles.chipIcon} />
        {t.chipTapQr}
      </div>
      <div className={`${styles.chip} ${styles.chipBottomRight}`}>
        <Check className={`${styles.chipIcon} ${styles.chipOk}`} />
        {t.chipSaved}
      </div>
    </div>
  );
}

/** The keychain drawn in code: a ring and a plum tag with the «S.» mark and the tap waves (no QR: tap only). */
function KeychainArt() {
  return (
    <svg viewBox="0 0 120 190" aria-hidden="true">
      <defs>
        <linearGradient id="kc-tag" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8a3870" />
          <stop offset="1" stopColor="#4a1839" />
        </linearGradient>
        <linearGradient id="kc-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f2efe9" />
          <stop offset="0.5" stopColor="#a9a2a8" />
          <stop offset="1" stopColor="#e6e1da" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="30" r="24" fill="none" stroke="url(#kc-metal)" strokeWidth="5" />
      <rect x="54" y="50" width="12" height="16" rx="5" fill="none" stroke="url(#kc-metal)" strokeWidth="4" />
      <path d="M22 86a18 18 0 0 1 18-18h40a18 18 0 0 1 18 18v62a38 38 0 0 1-38 38 38 38 0 0 1-38-38Z" fill="url(#kc-tag)" />
      <circle cx="60" cy="80" r="5" fill="#fbf7f1" opacity="0.9" />
      <path d="M22 86a18 18 0 0 1 18-18h40a18 18 0 0 1 18 18v62a38 38 0 0 1-38 38 38 38 0 0 1-38-38Z" fill="none" stroke="#cfa563" strokeOpacity="0.55" strokeWidth="1.2" />
      <text x="55" y="132" textAnchor="middle" style={{ fontFamily: "var(--font-display)" }} fontSize="38" fill="#fbf7f1">
        S
      </text>
      <circle cx="73" cy="129" r="3.6" fill="#cfa563" />
      <g transform="translate(46 146) scale(1.2)" fill="none" stroke="#cfa563" strokeWidth="1.8" strokeLinecap="round">
        <path d="M8.5 8.5a5 5 0 0 1 0 7M12 6a8.5 8.5 0 0 1 0 12M15.5 3.5a12 12 0 0 1 0 17" />
        <circle cx="5" cy="12" r="1.3" fill="#cfa563" stroke="none" />
      </g>
    </svg>
  );
}

/** The «Porta-chaves digital» hero: a phone taps the keychain and the business's WhatsApp chat opens. */
export function KeychainScene({ locale }: { locale: Locale }) {
  const t = localize(cardSceneCopy, locale);
  return (
    <div className={styles.scene} role="img" aria-label={t.keychainAria}>
      <div className={styles.halo} />
      <div className={styles.ring} />
      <div className={styles.keychain}>
        <KeychainArt />
        <span className={styles.pulse} />
        <span className={`${styles.pulse} ${styles.pulseLate}`} />
      </div>
      <Phone idle={t.idle}>
        <div className={styles.chatHeader}>
          <span className={styles.chatAvatar}>
            S<span>.</span>
          </span>
          <span className={styles.chatTitle}>
            <span className={styles.chatName}>{t.chatName}</span>
            <span className={styles.chatStatus}>{t.chatStatus}</span>
          </span>
        </div>
        <div className={styles.chatBody}>
          <span className={styles.bubble}>{t.chatBubble}</span>
        </div>
        <div className={styles.chatInput}>
          <span className={styles.chatField}>{t.chatInput}</span>
          <span className={styles.chatSend}>
            <ArrowRight />
          </span>
        </div>
      </Phone>
      <div className={`${styles.chip} ${styles.chipTopLeft}`}>
        <TapWaves className={styles.chipIcon} />
        {t.chipTapOnly}
      </div>
      <div className={`${styles.chip} ${styles.chipBottomRight}`}>
        <Check className={`${styles.chipIcon} ${styles.chipOk}`} />
        {t.chipDestinations}
      </div>
    </div>
  );
}

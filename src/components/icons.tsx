import type { ReactNode, SVGProps } from "react";
import type { ProductIcon } from "@/content/products";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function StrokeIcon({ size = 20, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </StrokeIcon>
);

export const ArrowLeft = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </StrokeIcon>
);

export const ArrowUpRight = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M7 17 17 7M8 7h9v9" />
  </StrokeIcon>
);

export const Check = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="m5 12.5 4.2 4.2L19 7" />
  </StrokeIcon>
);

export const ChevronDown = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="m6 9 6 6 6-6" />
  </StrokeIcon>
);

export const MenuIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </StrokeIcon>
);

export const CloseIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </StrokeIcon>
);

export const SunIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
  </StrokeIcon>
);

export const MoonIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
  </StrokeIcon>
);

export const GlobeIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.7 3.7 5.7 3.7 9s-1.2 6.3-3.7 9c-2.5-2.7-3.7-5.7-3.7-9S9.5 5.7 12 3Z" />
  </StrokeIcon>
);

export const MailIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7 8 6 8-6" />
  </StrokeIcon>
);

export const PhoneIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M5 4h3.5l1.5 4.5-2.2 1.3a11 11 0 0 0 6.4 6.4l1.3-2.2L20 15.5V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </StrokeIcon>
);

export const InstagramIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
  </StrokeIcon>
);

export const ClockIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </StrokeIcon>
);

export const MapPinIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M12 21s-7-6.1-7-11.5a7 7 0 1 1 14 0C19 14.9 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </StrokeIcon>
);

export const InfoIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 7.5v.5" />
  </StrokeIcon>
);

export const AlertIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M12 3.5 21.5 20h-19L12 3.5Z" />
    <path d="M12 10v4M12 17v.5" />
  </StrokeIcon>
);

export const LightbulbIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z" />
  </StrokeIcon>
);

export const SparkleIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M12 3.5 13.8 9 19.5 11 13.8 13 12 18.5 10.2 13 4.5 11 10.2 9 12 3.5Z" />
    <path d="M19 3v3M17.5 4.5h3" />
  </StrokeIcon>
);

export const PlusIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M12 5v14M5 12h14" />
  </StrokeIcon>
);

/** Single-colour Google "G" (follows currentColor), for links that open a place on Google. */
export const GoogleG = ({ size = 20, ...rest }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...rest}>
    <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z" />
  </svg>
);

export const MinusIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M5 12h14" />
  </StrokeIcon>
);

export const CartIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M3 4h2.2l2.1 10.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1L20.5 8H6.1" />
    <circle cx="9.5" cy="19.5" r="1.2" />
    <circle cx="17" cy="19.5" r="1.2" />
  </StrokeIcon>
);

export const UserIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.8 20a7.2 7.2 0 0 1 14.4 0" />
  </StrokeIcon>
);

export const EyeIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </StrokeIcon>
);

export const EyeOffIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M10.6 5.6A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.7 3.4M6.6 6.6C3.9 8.3 2.5 12 2.5 12S6 18.5 12 18.5c1.9 0 3.5-.6 4.9-1.5" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2M3 3l18 18" />
  </StrokeIcon>
);

export const TrashIcon = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M4.5 7h15M9.5 7V4.8h5V7M6.5 7l.8 12.2h9.4L17.5 7M10.2 10.5v5.5M13.8 10.5v5.5" />
  </StrokeIcon>
);

export const NfcWaves = (props: IconProps) => (
  <StrokeIcon {...props}>
    <path d="M8.5 8.5a5 5 0 0 1 0 7M12 6a8.5 8.5 0 0 1 0 12M15.5 3.5a12 12 0 0 1 0 17" />
    <circle cx="5" cy="12" r="1.2" fill="currentColor" stroke="none" />
  </StrokeIcon>
);

export const StarFilled = ({ size = 20, ...rest }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...rest}>
    <path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2 6.4 20.2l1.1-6.3L2.9 9.5l6.3-.9L12 2.8Z" />
  </svg>
);

export const WhatsAppIcon = ({ size = 20, ...rest }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...rest}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.69.44 3.34 1.28 4.79L2.05 22l5.45-1.43a9.9 9.9 0 0 0 4.54 1.16h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.13-2.9-7-1.87-1.87-4.35-2.82-7-2.82Zm0 18.13h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.24.85.86-3.16-.2-.32a8.22 8.22 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.25-8.15 8.31Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.04-.38-1.99-1.22-.73-.66-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.36-.77-1.86-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.22.89 2.41 1.02 2.57.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.11-.23-.17-.48-.3Z" />
  </svg>
);

const productIconPaths: Record<ProductIcon, ReactNode> = {
  "star-tap": (
    <>
      <path d="m9.5 4.5 1.5 3 3.3.5-2.4 2.3.6 3.3-3-1.6-3 1.6.6-3.3L4.7 8l3.3-.5 1.5-3Z" />
      <path d="M16 13.5a4 4 0 0 1 0 5M18.5 11.5a7 7 0 0 1 0 9" />
    </>
  ),
  "share-tap": (
    <>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="17" cy="6" r="2.5" />
      <circle cx="17" cy="18" r="2.5" />
      <path d="m8.2 10.8 6.6-3.6M8.2 13.2l6.6 3.6" />
    </>
  ),
  stamp: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <circle cx="8" cy="10" r="1.4" />
      <circle cx="12" cy="10" r="1.4" />
      <circle cx="16" cy="10" r="1.4" />
      <circle cx="8" cy="14.5" r="1.4" />
      <path d="m15 14.5 1 1 2-2.2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="3" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
      <path d="m9 14.5 2 2 4-4" />
    </>
  ),
  queue: (
    <>
      <circle cx="7" cy="8" r="2.5" />
      <path d="M3 18a4 4 0 0 1 8 0" />
      <circle cx="16.5" cy="13" r="4.5" />
      <path d="M16.5 10.8V13l1.5 1" />
    </>
  ),
  chat: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4A2.5 2.5 0 0 1 4 13.5v-8Z" />
      <path d="m12 6.5.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />
    </>
  ),
  voice: (
    <>
      <path d="M5 4h3l1.3 3.8-1.8 1.1a9.5 9.5 0 0 0 4.6 4.6l1.1-1.8L17 13v3a2 2 0 0 1-2 2A13 13 0 0 1 3 6a2 2 0 0 1 2-2Z" />
      <path d="M15 4.5v3M18 3v6M21 5v2" />
    </>
  ),
  "shield-star": (
    <>
      <path d="M12 3 19.5 6v5.5c0 4.5-3.2 8.2-7.5 9.5-4.3-1.3-7.5-5-7.5-9.5V6L12 3Z" />
      <path d="m12 8 1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.4L12 8Z" />
    </>
  ),
  flow: (
    <>
      <rect x="3" y="3.5" width="6" height="5" rx="1.5" />
      <rect x="15" y="9.5" width="6" height="5" rx="1.5" />
      <rect x="3" y="15.5" width="6" height="5" rx="1.5" />
      <path d="M9 6h2.5a2 2 0 0 1 2 2v2.5a1.5 1.5 0 0 0 1.5 1.5M9 18h2.5a2 2 0 0 0 2-2v-2.5a1.5 1.5 0 0 1 1.5-1.5" />
    </>
  ),
};

export function ProductGlyph({ icon, ...props }: IconProps & { icon: ProductIcon }) {
  return <StrokeIcon {...props}>{productIconPaths[icon]}</StrokeIcon>;
}

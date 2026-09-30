import Image from "next/image";
import { photos, type PhotoId } from "@/content/media";
import type { Locale } from "@/lib/i18n";

interface PhotoProps {
  id: PhotoId;
  locale: Locale;
  sizes: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  parallax?: boolean;
  fill?: boolean;
}

export function Photo({ id, locale, sizes, className = "", imageClassName = "", priority = false, parallax = false, fill = true }: PhotoProps) {
  const photo = photos[id];
  if (!fill) {
    return (
      <Image
        src={photo.src}
        alt={photo.alt[locale]}
        width={photo.width}
        height={photo.height}
        sizes={sizes}
        priority={priority}
        className={`${className} ${imageClassName}`}
      />
    );
  }
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={photo.src}
        alt={photo.alt[locale]}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${parallax ? "parallax-media" : ""} ${imageClassName}`}
      />
    </div>
  );
}

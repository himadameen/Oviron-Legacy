import Image from "next/image";
import { brandLogo } from "@/lib/images";
import styles from "./BrandLogo.module.css";

const LOGO_WIDTH = 800;
const LOGO_HEIGHT = 256;

type BrandLogoVariant = "header" | "footer" | "mobile";

type BrandLogoProps = {
  variant?: BrandLogoVariant;
  priority?: boolean;
  className?: string;
};

const variantClass: Record<BrandLogoVariant, string> = {
  header: styles.header,
  footer: styles.footer,
  mobile: styles.mobile,
};

export default function BrandLogo({
  variant = "header",
  priority = false,
  className,
}: BrandLogoProps) {
  const frameClass =
    variant === "footer" ? styles.frameDark : styles.frameLight;

  return (
    <span className={[styles.frame, frameClass, className].filter(Boolean).join(" ")}>
      <Image
        src={brandLogo.full}
        alt="Oviron — Global Trade, Import, Export"
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        className={variantClass[variant]}
        priority={priority}
        sizes="(max-width: 560px) 168px, (max-width: 960px) 200px, 256px"
      />
    </span>
  );
}

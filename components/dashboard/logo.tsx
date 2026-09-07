import Image from "next/image";

interface LogoProps {
  size?: number;
  className?: string;
}

/**
 * Logo perusahaan, dipakai di header dashboard, halaman login, dan
 * landing page — satu sumber file supaya konsisten. File asli ada di
 * /public/LOGO ADIRA.png.
 */
export function Logo({ size = 28, className = "" }: LogoProps) {
  return (
    <div
  className={`flex items-center justify-center overflow-hidden rounded-lg ${className}`}
  style={{ width: size, height: size }}
>
  <Image
    src="/LOGO ADIRA.png"
    alt="PT. Adira Semesta Industry"
    width={size}
    height={size}
    className="h-full w-full object-contain"
  />
</div>
  );
}

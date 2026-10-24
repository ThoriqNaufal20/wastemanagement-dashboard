interface LogoProps {
  size?: number;
  className?: string;
}

/**
 * Logo perusahaan, dipakai di header dashboard, halaman login, dan
 * landing page — satu sumber file supaya konsisten. File asli ada di
 * /public/LOGO ADIRA.png.
 * 
 * Menggunakan tag <img> standar untuk keamanan maksimal (bypass /_next/image runtime).
 */
export function Logo({ size = 28, className = "" }: LogoProps) {
  const hasCustomSize = className.includes("w-") || className.includes("h-");

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg ${className}`}
      style={hasCustomSize ? undefined : { width: size, height: size }}
    >
      <img
        src="/LOGO ADIRA.png"
        alt="PT. Adira Semesta Industry"
        width={size * 2}
        height={size * 2}
        className="h-full w-full object-contain"
        loading="eager"
      />
    </div>
  );
}

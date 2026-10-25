import Image from "next/image";
import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className="inline-flex min-h-11 shrink-0 items-center rounded-md"
      aria-label="Página inicial CarePoint"
    >
      <Image
        src="/brand/carepoint-logo-transparent.png"
        width={2029}
        height={775}
        alt="CarePoint"
        className={`h-auto w-[140px] sm:w-[160px] ${light ? "brightness-150" : "dark:brightness-150"}`}
        priority
      />
    </Link>
  );
}

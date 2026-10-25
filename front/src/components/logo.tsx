import Image from "next/image";
import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className={`inline-flex shrink-0 overflow-hidden rounded-xl bg-[#080808] ${light ? "ring-1 ring-white/15" : "ring-1 ring-black/5"}`}
      aria-label="Página inicial CarePoint"
    >
      <Image
        src="/brand/carepoint-logo.png"
        width={280}
        height={107}
        alt="CarePoint"
        className="h-auto w-[140px] sm:w-[160px]"
        priority
      />
    </Link>
  );
}

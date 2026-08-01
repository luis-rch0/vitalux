import Image from "next/image";
import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return <Link href="/" className={`inline-flex items-center gap-2 font-bold text-xl ${light ? "text-white" : "text-brand-700 dark:text-brand-300"}`} aria-label="Página inicial CarePoint">
    <Image src="/carepoint-mark.svg" width={34} height={34} alt="" priority /> CarePoint
  </Link>;
}

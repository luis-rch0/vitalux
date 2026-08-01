import type { HTMLAttributes } from "react";
export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) { return <section className={`surface p-5 ${className}`} {...props} />; }

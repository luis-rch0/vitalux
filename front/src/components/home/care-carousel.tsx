"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useI18n } from "@/providers/i18n-provider";

const stories = [
  {
    image: "cuidado-domiciliar-familia.png",
    pt: "Cada família tem um jeito de cuidar.",
    en: "Every family has its own way to care.",
    altPt: "Profissional de saúde conversando com um homem idoso e uma familiar em casa",
    altEn: "Healthcare professional speaking with an older man and a family member at home",
    tagPt: "Perto de quem importa",
    tagEn: "Close to those who matter",
  },
  {
    image: "fisioterapeuta-carepoint.png",
    pt: "Encontre apoio para o seu próximo passo.",
    en: "Find support for your next step.",
    altPt: "Retrato ilustrativo de um profissional de saúde",
    altEn: "Illustrative portrait of a healthcare professional",
    tagPt: "Cuidado individualizado",
    tagEn: "Individual care",
  },
  {
    image: "medica-carepoint.png",
    pt: "Mais escuta. Mais presença no cuidado.",
    en: "More listening. More presence in care.",
    altPt: "Retrato ilustrativo de uma profissional de saúde",
    altEn: "Illustrative portrait of a healthcare professional",
    tagPt: "Conexões humanas",
    tagEn: "Human connections",
  },
];

export function CareCarousel() {
  const { locale } = useI18n();
  const en = locale === "en";
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  function go(index: number) {
    const target = Math.max(0, Math.min(stories.length - 1, index));
    const reduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.dataset.reducedMotion === "true";
    track.current?.scrollTo({
      left: target * track.current.clientWidth,
      behavior: reduced ? "instant" : "smooth",
    });
  }
  return (
    <section
      className="care-story-carousel"
      aria-roledescription={en ? "carousel" : "carrossel"}
      aria-label={
        en ? "Care for different moments of life" : "Cuidado em diferentes momentos da vida"
      }
    >
      <div
        ref={track}
        className="care-story-track"
        tabIndex={0}
        aria-label={
          en
            ? "Care images. Use arrow keys to browse."
            : "Imagens de cuidado. Use as setas para navegar."
        }
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            go(active + (event.key === "ArrowRight" ? 1 : -1));
          }
          if (event.key === "Home" || event.key === "End") {
            event.preventDefault();
            go(event.key === "Home" ? 0 : stories.length - 1);
          }
        }}
        onScroll={(event) => {
          const el = event.currentTarget;
          if (el.clientWidth) setActive(Math.round(el.scrollLeft / el.clientWidth));
        }}
      >
        {stories.map((story, i) => (
          <article
            key={story.image}
            className="care-story-slide"
            role="group"
            aria-roledescription={en ? "slide" : "slide"}
            aria-label={`${i + 1} / ${stories.length}`}
            aria-hidden={active !== i}
          >
            <Image
              src={`/images/${story.image}`}
              alt={en ? story.altEn : story.altPt}
              fill
              unoptimized
              sizes="(max-width: 767px) 100vw, 50vw"
              priority={i === 0}
              className="object-cover"
            />
            <div className="care-story-caption">
              <p className="text-xs font-bold uppercase tracking-widest">
                {en ? story.tagEn : story.tagPt}
              </p>
              <h2 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">
                {en ? story.en : story.pt}
              </h2>
              <p className="mt-3 text-xs text-white/80">
                {en ? "Illustrative image" : "Imagem ilustrativa"}
              </p>
            </div>
          </article>
        ))}
      </div>
      <div className="flex items-center justify-between gap-4 px-1 pt-4">
        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="text-xs font-semibold text-brand-700 dark:text-brand-200"
        >
          {en ? "Image" : "Imagem"} {active + 1} / {stories.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={en ? "Previous image" : "Imagem anterior"}
            disabled={active === 0}
            onClick={() => go(active - 1)}
            className="care-carousel-control"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            type="button"
            aria-label={en ? "Next image" : "Próxima imagem"}
            disabled={active === stories.length - 1}
            onClick={() => go(active + 1)}
            className="care-carousel-control"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

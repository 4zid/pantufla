"use client";

import { useState } from "react";

import { Reveal } from "@/components/motion/reveal";
import { useCopy } from "@/components/copy-provider";
import { fill } from "@/content/copy";
import { Button } from "@/components/ui/button";
import { ProjectStack } from "@/components/ui/project-stack";
import { Section, SectionHead } from "@/components/ui/section";
import type { SanityProject } from "@/sanity/types";

/**
 * Los proyectos, en la home y sin página aparte.
 *
 * Antes había un listado en /proyectos y acá un enlace hacia él. El listado
 * mostraba lo mismo que esta sección con otro título encima, así que el enlace
 * sacaba a la persona de la página para enseñarle lo que ya estaba viendo. Se
 * fue: ahora entran cuatro y el resto se pide acá mismo.
 *
 * De a dos y no todos de una. Con todos, el botón desaparece en el primer
 * toque y la sección da un salto de alto que descoloca; de a dos el salto es
 * de una fila y el botón sigue ahí mientras quede algo.
 *
 * Las fichas de cada proyecto siguen existiendo: lo que se fue es el índice,
 * no el detalle.
 */

/** Cuántos se ven al llegar, y cuántos suma cada toque. */
const INICIALES = 4;
const DE_A = 2;

export function Work({ projects }: { projects: SanityProject[] }) {
  const { work } = useCopy();
  const [visibles, setVisibles] = useState(INICIALES);

  if (!projects.length) return null;

  const mostrados = projects.slice(0, visibles);
  const faltan = projects.length - mostrados.length;

  return (
    <Section id="proyectos">
      <SectionHead
        icon="grilla"
        eyebrow={work.eyebrow}
        title={work.title}
        lead={work.lead}
      />

      <div className="mt-14">
        {/* La clave cambia con la cantidad para que las tarjetas nuevas entren
            con la misma animación que las primeras, en vez de aparecer secas
            mientras las de arriba ya estaban reveladas. */}
        <ProjectStack key={visibles} projects={mostrados} />
      </div>

      {faltan > 0 ? (
        <div className="mt-14 flex flex-col items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => setVisibles((v) => v + DE_A)}
          >
            {work.loadMore}
          </Button>
          {/*
            El contador dice cuánto falta antes de tocar, que es lo que decide
            si vale la pena: «4 de 5» y «4 de 20» piden cosas distintas.

            Y va con aria-live porque al sumar proyectos no cambia nada que un
            lector de pantalla anuncie solo —el foco se queda en el botón y las
            tarjetas nuevas entran más abajo, en silencio—. Con esto, cada toque
            dice en voz alta cuántos hay ahora.
          */}
          <p aria-live="polite" className="text-[0.88rem] text-ink-faint">
            {fill(work.counter, {
              shown: mostrados.length,
              total: projects.length,
            })}
          </p>
        </div>
      ) : null}
    </Section>
  );
}

"use client";

import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { useCopy, useHref } from "@/components/copy-provider";
import { ArrowIcon } from "@/components/ui/icons";
import { ProjectStack } from "@/components/ui/project-stack";
import { Section, SectionHead } from "@/components/ui/section";
import type { SanityProject } from "@/sanity/types";

export function Work({ projects }: { projects: SanityProject[] }) {
  const { work } = useCopy();
  const href = useHref();
  if (!projects.length) return null;

  return (
    <Section id="proyectos" tone="alt">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHead
          icon="grilla"
          eyebrow={work.eyebrow}
          title={work.title}
          lead={work.lead}
        />
        <Reveal delay={0.2}>
          <Link
            href={href("/proyectos")}
            className="group inline-flex shrink-0 items-center gap-2 text-[0.95rem] font-medium"
          >
            {work.viewAll}
            <ArrowIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>

      <div className="mt-14">
        <ProjectStack projects={projects} />
      </div>
    </Section>
  );
}

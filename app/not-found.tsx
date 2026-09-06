import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-4 text-h2">Esta página no existe.</h1>
      <p className="mt-4 max-w-md text-lead text-ink-soft">
        Puede que la hayamos movido o que el link esté mal escrito.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/" size="lg">
          Volver al inicio
        </ButtonLink>
        <ButtonLink href="/proyectos" variant="secondary" size="lg">
          Ver proyectos
        </ButtonLink>
      </div>
    </div>
  );
}

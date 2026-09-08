/**
 * Fondo del hero: cuatro campos de color muy desenfocados sobre el papel.
 * Es el único lugar del sitio donde los cuatro colores aparecen juntos, y se
 * mantienen en opacidad baja para que el titular conserve su contraste.
 */
export function HeroAurora() {
  const fields = [
    // El verde y el aqua quedan en los márgenes; el centro lo ocupan rosa y
    // miel, que es lo que le da el tono cálido en vez de un gris verdoso.
    { tone: "#6fcfca", x: "2%", y: "-4%", size: "42vw", opacity: 0.7 },
    { tone: "#f2a5b6", x: "48%", y: "-12%", size: "56vw", opacity: 0.95 },
    { tone: "#f4c87d", x: "62%", y: "34%", size: "48vw", opacity: 0.8 },
    { tone: "#a6cf95", x: "-8%", y: "56%", size: "42vw", opacity: 0.45 },
  ];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {fields.map((field) => (
        <div
          key={field.tone}
          className="drift absolute rounded-full"
          style={{
            left: field.x,
            top: field.y,
            width: field.size,
            height: field.size,
            opacity: field.opacity,
            filter: "blur(90px)",
            background: `radial-gradient(circle, ${field.tone} 0%, transparent 70%)`,
          }}
        />
      ))}
      {/* Un velo de papel en el centro: mantiene el titular limpio sin apagar
          el color de los costados. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 42% 34% at 50% 46%, rgba(247,245,240,0.62) 0%, transparent 72%)",
        }}
      />
      {/* El papel vuelve a subir en los bordes para que el color no ensucie. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 78% 68% at 50% 42%, transparent 55%, var(--color-paper) 100%)",
        }}
      />
    </div>
  );
}

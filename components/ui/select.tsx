"use client";

import { useEffect, useId, useRef, useState } from "react";

import { CheckIcon, ChevronDownIcon } from "@/components/ui/icons";
import { fieldClass } from "@/components/ui/field";
import { cn } from "@/lib/cn";

export type Option = { value: string; label: string };

/**
 * Un selector propio.
 *
 * El <select> nativo abre el menú del sistema: en Mac es una lista gris con
 * el azul de siempre, y en el sitio queda como un cuerpo extraño. Este
 * dibuja el menú con las piezas del sitio —la tarjeta, la línea, la tinta—
 * y se porta como un select: se abre con clic, con Enter, con Espacio o con
 * las flechas; se recorre con las flechas, Inicio y Fin; se elige con Enter
 * o con clic; se cierra con Escape, con Tab (eligiendo la marcada, como el
 * nativo) o con un clic afuera. Escribir una letra salta a la primera
 * opción que empieza así.
 *
 * Para el formulario es un campo más: el valor viaja en un input oculto con
 * el name que le den, y FormData lo levanta igual que a un select. La
 * etiqueta apunta al botón con htmlFor, como apuntaba al select.
 *
 * Accesibilidad: es el patrón «select-only combobox» de ARIA. El foco se
 * queda en el botón y aria-activedescendant dice qué opción está marcada.
 *
 * El menú se abre para abajo, salvo que ahí no entre y arriba sí.
 */
export function Select({
  id,
  name,
  options,
  defaultValue,
  className,
}: {
  id: string;
  name: string;
  options: Option[];
  defaultValue?: string;
  className?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? options[0]?.value ?? "");
  const [open, setOpen] = useState(false);
  const [marcada, setMarcada] = useState(0);
  const [arriba, setArriba] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const boton = useRef<HTMLButtonElement>(null);
  const idLista = useId();
  const actual = options.find((o) => o.value === value) ?? options[0];

  /* Alto estimado del menú: una fila por opción más el aire. Alcanza para
     decidir de qué lado abrirlo sin medirlo después de pintarlo. */
  function abrir() {
    const i = options.findIndex((o) => o.value === value);
    setMarcada(i < 0 ? 0 : i);
    const caja = boton.current?.getBoundingClientRect();
    if (caja) {
      const alto = options.length * 44 + 20;
      setArriba(window.innerHeight - caja.bottom < alto && caja.top > alto);
    }
    setOpen(true);
  }
  function cerrar() {
    setOpen(false);
  }
  function elegir(i: number) {
    if (options[i]) setValue(options[i].value);
    cerrar();
  }

  /* Un clic afuera cierra. El botón pierde el foco al clickear afuera, y
     eso ya cierra; el listener es para los casos en que el foco no se va
     (Safari no enfoca los botones al clickearlos). */
  useEffect(() => {
    if (!open) return;
    function afuera(e: PointerEvent) {
      if (!root.current?.contains(e.target as Node)) cerrar();
    }
    document.addEventListener("pointerdown", afuera, true);
    return () => document.removeEventListener("pointerdown", afuera, true);
  }, [open]);

  function alTecla(e: React.KeyboardEvent<HTMLButtonElement>) {
    const ultima = options.length - 1;
    if (!open) {
      if (
        ["ArrowDown", "ArrowUp", "Enter", " ", "Home", "End"].includes(e.key)
      ) {
        e.preventDefault();
        abrir();
      } else if (e.key.length === 1 && /\S/.test(e.key)) {
        // Cerrado, una letra elige directo, como el select nativo.
        const i = buscar(e.key);
        if (i >= 0) setValue(options[i].value);
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setMarcada((m) => Math.min(m + 1, ultima));
        break;
      case "ArrowUp":
        e.preventDefault();
        setMarcada((m) => Math.max(m - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setMarcada(0);
        break;
      case "End":
        e.preventDefault();
        setMarcada(ultima);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        elegir(marcada);
        break;
      case "Escape":
        e.preventDefault();
        cerrar();
        break;
      case "Tab":
        elegir(marcada);
        break;
      default:
        if (e.key.length === 1 && /\S/.test(e.key)) {
          const i = buscar(e.key);
          if (i >= 0) setMarcada(i);
        }
    }
  }
  function buscar(letra: string) {
    const l = letra.toLocaleLowerCase();
    return options.findIndex((o) => o.label.toLocaleLowerCase().startsWith(l));
  }

  return (
    <div ref={root} className={cn("relative", className)}>
      <input type="hidden" name={name} value={value} />
      <button
        ref={boton}
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={idLista}
        aria-activedescendant={open ? `${idLista}-${marcada}` : undefined}
        className={cn(
          fieldClass,
          "flex cursor-pointer items-center justify-between gap-3 text-left",
          open && "border-ink",
        )}
        onClick={() => (open ? cerrar() : abrir())}
        onKeyDown={alTecla}
        onBlur={cerrar}
      >
        <span className="truncate">{actual?.label}</span>
        <ChevronDownIcon
          className={cn(
            "h-4 w-4 shrink-0 text-ink-faint transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        /* pointerdown prevenido: el clic en una opción no le saca el foco
           al botón, así el menú no se cierra antes de que llegue el click. */
        <ul
          id={idLista}
          role="listbox"
          aria-labelledby={id}
          data-arriba={arriba ? "" : undefined}
          className={cn(
            "desplegable absolute left-0 z-30 min-w-full rounded-2xl border border-line bg-card p-1.5 shadow-[0_18px_40px_-14px_rgba(0,0,0,0.35)]",
            arriba ? "bottom-[calc(100%+0.4rem)]" : "top-[calc(100%+0.4rem)]",
          )}
          onPointerDown={(e) => e.preventDefault()}
        >
          {options.map((o, i) => {
            const elegida = o.value === value;
            return (
              <li
                key={o.value}
                id={`${idLista}-${i}`}
                role="option"
                aria-selected={elegida}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-4 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-[0.95rem] text-ink",
                  i === marcada && "bg-ink/6",
                )}
                onMouseMove={() => setMarcada(i)}
                onClick={() => elegir(i)}
              >
                <span className="truncate">{o.label}</span>
                <CheckIcon
                  className={cn(
                    "h-3.5 w-3.5 shrink-0",
                    elegida ? "text-ink" : "invisible",
                  )}
                />
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

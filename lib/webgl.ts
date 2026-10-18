/**
 * Si vale la pena dibujar en 3D en esta máquina.
 *
 * Con una placa de video por software (SwiftShader, llvmpipe: lo que da el
 * Chrome sin pantalla de Lighthouse, o una máquina virtual) cada cuadro
 * cuesta cientos de milisegundos, así que ni se baja Three.js: queda la
 * imagen. failIfMajorPerformanceCaveat ya lo pide, pero algunos navegadores
 * lo ignoran, y por eso también se mira el nombre del renderizador.
 *
 * Lo usan el pase y el globo. `forzar` es el parámetro de la URL que lo
 * fuerza (?pase3d, ?globo3d), para probarlo en un navegador sin placa.
 */
export function sePuede3d(forzar: string): { si: boolean; forzado: boolean } {
  if (new URLSearchParams(window.location.search).has(forzar)) {
    return { si: true, forzado: true };
  }
  try {
    const c = document.createElement("canvas");
    const op = { failIfMajorPerformanceCaveat: true };
    const gl =
      (c.getContext("webgl2", op) as WebGL2RenderingContext | null) ??
      (c.getContext("webgl", op) as WebGLRenderingContext | null);
    if (!gl) return { si: false, forzado: false };
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const nombre = String(
      info
        ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL)
        : gl.getParameter(gl.RENDERER),
    );
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return {
      si: !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(nombre),
      forzado: false,
    };
  } catch {
    return { si: false, forzado: false };
  }
}

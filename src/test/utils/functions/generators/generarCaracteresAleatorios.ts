export default function generarCaracteresAleatorios(longitud: number = 8): string {
  if (longitud <= 0) return "";

  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const indices = new Uint8Array(longitud);
  crypto.getRandomValues(indices);

  return Array.from(indices)
    .map((index) => caracteres[index % caracteres.length])
    .join("");
}

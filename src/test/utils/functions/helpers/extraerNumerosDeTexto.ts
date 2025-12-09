export default function extraerNumerosDeTexto(texto: string): number {
  const onlyNumber = parseFloat(texto.replace(/[^0-9.]/g, ""));
  return onlyNumber;
}

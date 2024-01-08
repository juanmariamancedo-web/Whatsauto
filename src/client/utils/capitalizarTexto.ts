export default function capitalizarTexto(texto:string) {
    // Dividir el texto en palabras separadas por espacios
    const palabras = texto.toLowerCase().split(" ");
  
    // Capitalizar el primer carácter de cada palabra
    const palabrasCapitalizadas = palabras.map((palabra) => {
      return palabra.charAt(0).toUpperCase() + palabra.slice(1);
    });
  
    // Unir las palabras capitalizadas en un nuevo texto
    const textoCapitalizado = palabrasCapitalizadas.join(" ");
  
    return textoCapitalizado;
  }
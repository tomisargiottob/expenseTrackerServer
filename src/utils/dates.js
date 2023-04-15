export function convertDateToAAAAMMDD(dateToConvert) {
    const date = new Date(dateToConvert);
    const anio = date.getFullYear();
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const dia = date.getDate().toString().padStart(2, '0');
    return `${anio}${mes}${dia}`;
  }


export function parseStringResponse(inputText){
  let text = inputText.replace(/Ã¡/g, 'á')
             .replace(/Ã©/g, 'é')
             .replace(/Ã­/g, 'í')
             .replace(/Ã³/g, 'ó')
             .replace(/Ãº/g, 'ú')
             .replace(/Ã±/g, 'ñ')
             .replace(/Ã³n/g, 'ón')
             .replace(/Ã³s/g, 'ós')
             .replace(/Ã³n/g, 'ón')
             .replace(/Ã©n/g, 'én')
             .replace(/Ã¡n/g, 'án')
             .replace(/Ãºn/g, 'ún')
             .replace(/Ã­a/g, 'ía')
             .replace(/Ã¼/g, 'ü');

  return text
}
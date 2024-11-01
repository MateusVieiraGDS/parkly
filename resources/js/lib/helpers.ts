import { useCallback, useState } from "react";

export const useCenteredTree = (defaultTranslate = { x: 0, y: 0 }) => {
  const [translate, setTranslate] = useState(defaultTranslate);
  const [dimensions, setDimensions] = useState<any>();
  const containerRef = useCallback((containerElem:any) => {
    if (containerElem !== null) {
      const { width, height } = containerElem.getBoundingClientRect();
      setDimensions({ width, height });
      setTranslate({ x: width / 2, y: height / 2 });
    }
  }, []);
  return [dimensions, translate, containerRef];
};


/**
 * Normaliza o número de telefone adicionando o código de país se necessário.
 * @param {string | number} phone - Número de telefone em formato livre.
 * @param {boolean} withPlus - (Default: True) - Se deve incluir o símbolo '+' no início do número.
 * @returns {string} - Número de telefone normalizado com código de país.
 */
export function phoneNormalizeSet(phone: string | number, withPlus: boolean = true) {
  // Remove todos os caracteres que não são números
  const cleanedValue = (phone+"").replace(/\D/g, '');
  const phoneLength = cleanedValue.length;
  let plus = withPlus ? '+' : '';

  // Adiciona o código de país '55' se o número tiver 10 ou 11 dígitos
  if (phoneLength === 10 || phoneLength === 11) {
      return `${plus}55${cleanedValue}`;
  }

  // Retorna o número limpo, sem alteração
  return `${plus}${cleanedValue}`;
}

/**
* Normaliza o número de telefone removendo o código de país se presente.
* @param {string} phone - Número de telefone em formato livre.
* @returns {string} - Número de telefone sem o código de país.
*/
export function phoneNormalizeGet(phone: string) {
  // Remove todos os caracteres que não são números
  const cleanedValue = phone.replace(/\D/g, '');
  const phoneLength = cleanedValue.length;

  // Remove o código de país '55' se o número tiver 12 ou 13 dígitos
  if (phoneLength === 12 || phoneLength === 13) {
      if (cleanedValue.startsWith('55')) {
          return cleanedValue.substring(2);
      }
  }

  // Retorna o número limpo, sem alteração
  return cleanedValue;
}
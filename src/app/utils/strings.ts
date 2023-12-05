import { ACRONYMS, PREPOSITIONS } from '../constants/misc';

/**
 * Función para transformar texto a title-case con algunas modificaciones:
 * Si tiene números romanos los convierte a mayúscula,  y si tiene preposiciones las convierte
 * a minúscula.
 *
 * @param texto
 * @returns
 */
export const titleCase = (text: string) => {
    const regRomanNum = new RegExp(/^(ix|iv|v?i{0,3})$/);
    return text
        .split(' ')
        .map((word) => {
            if (word.startsWith('(')) return word;

            if (ACRONYMS.includes(word.toUpperCase())) {
                return word.toUpperCase();
            }

            /** Las preposiciones las mantiene en minuscula */
            if (PREPOSITIONS.includes(word.toLowerCase())) return word.toLowerCase();

            /** Si es un numero romano lo convierte a mayuscula */
            if (regRomanNum.test(word.toLowerCase())) return word.toUpperCase();

            return word[0].toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
};

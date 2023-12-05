import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sentenceCase',
})
export class SentenceCasePipe implements PipeTransform {
  /** regex para números romanos */
  regRomanNum = /\b([ivx]+)\b/gi;
  /**
   * Método para transformar texto a sentence case
   *
   * @param text texto a transformar
   * @param skipUppercase si evita las transformaciones a palabras completamente en mayúscula
   * @returns
   */
  transform(text: string, skipUppercase = true): string {
    const sentence = !skipUppercase
      ? this.toSentenceCase(text)
      : text
          .split(' ')
          .map((word, index) => {
            if (word.toUpperCase() === word) {
              return word;
            }

            if (index === 0) {
              return this.toSentenceCase(word);
            }

            return word.toLowerCase();
          })
          .join(' ');

    /** Si hay números romanos los convierte a mayúscula */
    return sentence.replace(this.regRomanNum, (_, p1) => p1.toUpperCase());
  }

  toSentenceCase(word: string) {
    return word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : '';
  }
}

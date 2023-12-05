import { Pipe, PipeTransform } from '@angular/core';
import { titleCase } from 'src/app/utils/strings';

@Pipe({
  name: 'title',
})
export class TitlePipe implements PipeTransform {
  /**
   * Método para transformar texto a title-case con algunas modificaciones:
   * Si tiene números romanos los convierte a mayúscula,  y si tiene preposiciones las convierte
   * a minúscula.
   *
   * @param text texto
   * @returns
   */
  transform(text: string): string {
    return titleCase(text);
  }
}

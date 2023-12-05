import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'map',
})
export class MapPipe implements PipeTransform {
  /**
   * Método para transformar texto a sentence case
   *
   * @param text texto a transformar
   * @param skipUppercase si evita las transformaciones a palabras completamente en mayúscula
   * @returns
   */
  transform(value: any, func: (arg: any) => any): unknown {
    return func(value);
  }
}

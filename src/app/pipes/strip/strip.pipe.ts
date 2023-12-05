import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'strip',
})
export class StripPipe implements PipeTransform {
  /**
   * Remueve espacios adicionales en el string
   *
   * @param value string
   * @returns
   */
  transform(value: string): string {
    return value?.replace(/^\s+|\s+$/g, '').replace(/\s\s+/g, ' ');
  }
}

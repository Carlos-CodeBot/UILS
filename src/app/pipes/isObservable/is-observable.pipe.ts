import { Pipe, PipeTransform } from '@angular/core';
import { isObservable } from 'rxjs';
/**
 * Pipe para saber si una variable es observable
 */
@Pipe({
  name: 'isObservable',
})
export class IsObservablePipe implements PipeTransform {
  /**
   * Función para evaluar si una variable es observable
   *
   * @param value - Valor a evaluar
   * @returns - True si es observable, false si no lo es
   */
  transform(value: any): any {
    return isObservable(value);
  }
}

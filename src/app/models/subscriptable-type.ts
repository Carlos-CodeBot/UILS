import { Observable, Subscribable } from 'rxjs';

/**
 * Tipo que define una variable a la cual me puedo subscribir.
 */
export type SubscriptableType =
  | Subscribable<any>
  | Observable<any>
  | Promise<any>
  | any;

import { Pipe, PipeTransform } from '@angular/core';
import { isRoute } from 'src/app/utils/routes';

@Pipe({
  name: 'isRoute',
})
export class IsRoutePipe implements PipeTransform {
  transform(currentRoute: string, targetRoute: string): boolean {
    return isRoute(currentRoute, targetRoute);
  }
}

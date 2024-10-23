import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeDeluxe',
  standalone: true
})
export class RemoveDeluxePipe implements PipeTransform {

  transform(value: string): string {
    if (value.includes("(Deluxe")) {
      return value.split("(Deluxe")[0];
    }
    if (value.includes("(Extended")) {
      return value.split("(Extended")[0];
    }
    if (value.includes("[Deluxe")) {
      return value.split("[Deluxe")[0];
    }
    return value;
  }

}

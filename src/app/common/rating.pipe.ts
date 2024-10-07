import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ratingPipe',
  standalone: true
})
export class RatingPipe implements PipeTransform {

  transform(value: number): string {
    value = Math.floor(value);
    switch (value) {
      case 11:
      case 10:
        return "PERFECT";
      case 9:
        return "AMAZING";
      case 8:
        return "VERY GOOD";
      case 7:
        return "GOOD";
      case 6:
        return "SOLID";
      case 5:
        return "OKAY";
      case 4:
        return "MID";
      case 3:
        return "BAD";
      case 2:
      case 1:
        return "TRASH";
      case 0:
        return "UNRATED";
      default:
        return value.toString();

    }
  }

}

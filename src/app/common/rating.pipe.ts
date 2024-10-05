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
        return "CLASSIC";
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
        return "MID";
      case 4:
      case 3:
      case 2:
      case 1:
        return "BAD";
      case 0:
        return "UNRATED";
      default:
        return value.toString();

    }
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ratingPipe',
  standalone: true
})
export class RatingPipe implements PipeTransform {

  transform(value: number, shortForm : boolean = false): string {
    value = Math.floor(value);
    switch (value) {
      case 11:
      case 10:
        return shortForm ? "10" : "FLAWLESS";
      case 9:
        return shortForm ? "9" : "AMAZING";
      case 8:
        return shortForm ? "8" : "VERY GOOD";
      case 7:
        return shortForm ? "7" : "GOOD";
      case 6:
        return shortForm ? "6" : "SOLID";
      case 5:
        return shortForm ? "5" : "OKAY";
      case 4:
        return shortForm ? "4" : "MID";
      case 3:
        return shortForm ? "3" : "BAD";
      case 2:
        return shortForm ? "2" : "VERY BAD";
      case 1:
        return shortForm ? "1" : "TRASH";
      case 0:
        return shortForm ? "?" : "UNRATED";
      default:
        return value.toString();

    }
  }

}

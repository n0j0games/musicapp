import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeFeat',
  standalone: true
})
export class RemoveFeatPipe implements PipeTransform {

  transform(values: string): string {
    const split = values.split("; ");
    for (let value in split) {
      if (split[value].includes("(feat")) {
        split[value] = split[value].split("(feat")[0];
      } else if (split[value].includes("(with")) {
        split[value]  = split[value].split("(with")[0];
      } else if (split[value].includes("[feat")) {
        split[value]  = split[value].split("[feat")[0];
      } else if (split[value].includes("[with")) {
        split[value]  = split[value].split("[with")[0];
      }
    }
    return split.join(", ");
  }

}

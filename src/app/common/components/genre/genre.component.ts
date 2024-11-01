import {Component, Input} from '@angular/core';
import {NgIf, NgStyle} from "@angular/common";
import {RatingPipe} from "../../pipes/rating.pipe";

@Component({
  selector: 'app-genre',
  standalone: true,
  imports: [
    NgIf,
    RatingPipe,
    NgStyle
  ],
  templateUrl: './genre.component.html',
  styleUrl: './genre.component.scss'
})
export class GenreComponent {

    @Input() genre!: string;

    jazzGenres = ["jazz","soul","disco","funk"]

    getColor() {
      const lowerCaseGenre = this.genre.toLowerCase();
      if (this.jazzGenres.includes(lowerCaseGenre)) {
        return "#a35e42";
      }
      if (lowerCaseGenre.includes("rap") || lowerCaseGenre.includes("hip")) {
        return "#0080AEFF";
      }
      if (lowerCaseGenre.includes("rock") || lowerCaseGenre.includes("shoegaze") || lowerCaseGenre.includes("dreampop")) {
        return "#7aa865";
      }
      if (lowerCaseGenre.includes("pop") || lowerCaseGenre.includes("country") || lowerCaseGenre.includes("songwriter") ||lowerCaseGenre.includes("folk")) {
        return "#a65858";
      }
      if (lowerCaseGenre.includes("electronic") || lowerCaseGenre.includes("house")) {
        return "#bab863";
      }
      if (lowerCaseGenre.includes("latin") || lowerCaseGenre.includes("r&b")) {
        return "#ba68ba";
      }
      if (lowerCaseGenre.includes("indie")) {
        return "#b6925f";
      }
      return "#9a9a9a";
    }

    protected readonly Math = Math;
}

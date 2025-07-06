import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {RatingPipe} from "../../pipes/rating.pipe";
import {Logger} from "../../logger";
import {ProgressBarComponent} from "../progress-bar/progress-bar.component";

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [
    NgStyle,
    RatingPipe,
    NgIf,
    NgForOf,
    ProgressBarComponent
  ],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss'
})
export class RatingComponent implements OnInit, OnChanges {

  @Input() rating!: number | number[];
  @Input() activeSeason : number | undefined;
  singleRating : number | null = null;
  arrayRating : number[] | null = null;

  width : number = 0;

  private classic = "#b54c55"
  private perfect = "#b54c91"
  private amazing = "#0080ae";
  private verygood = "#00ae9f";
  private good = "#00ae6b";
  private solid = "#5aae00";
  private mid = "#8d9c0c";
  private bad = "#bd8e51";
  private horrible = "#bd5151"

  colors = [this.horrible, this.horrible, this.horrible, this.bad, this.bad, this.mid, this.solid, this.good, this.verygood, this.amazing, this.perfect, this.perfect];

  private logger: Logger = new Logger(this);

  ngOnChanges(changes: SimpleChanges) {
    if (this.singleRating) {
      this.width = this.calcWidth();
    }
  }

  ngOnInit() {
    this.setRatings(this.rating);
    if (this.singleRating == null && this.arrayRating == null) {
      this.logger.warn("Unknown rating type used");
    }
    if (this.arrayRating) {
      this.processRatingArray();
    }
    if (this.singleRating) {
      this.processSingleRating();
    }
  }

  processRatingArray() {
    for (const rating of this.arrayRating!) {
      if (rating < 0 || rating >= 12 ) {
        this.logger.warn("Unexpected rating", rating);
      }
    }
  }

  processSingleRating() {
    if (this.singleRating! < 0 || this.singleRating! >= 12 ) {
      this.logger.warn("Unexpected rating", this.singleRating);
    }
    this.width = this.calcWidth();
  }

  calcWidth() {
    const percent = this.singleRating!*10;
    return percent > 100 ? 100 : percent;
  }

  setRatings(rating : number | number[]) {
    if (Array.isArray(rating)) {
      this.arrayRating = rating;
      const peak =  Math.max(...rating);
      this.singleRating = this.activeSeason ? rating[this.activeSeason-1] : peak;
    } else {
      this.singleRating = rating;
    }
  }

  protected readonly Math = Math;
}

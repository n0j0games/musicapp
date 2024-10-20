import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NgStyle} from "@angular/common";
import {RatingPipe} from "../rating.pipe";

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [
    NgStyle,
    RatingPipe
  ],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss'
})
export class RatingComponent implements OnInit, OnChanges {

  @Input() rating!: number;

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

  ngOnChanges(changes: SimpleChanges) {
    this.width = this.calcWidth();
  }

  ngOnInit() {
    if (this.rating < 0 || this.rating >= 12 ) {
      console.warn("Unexpected rating", this.rating);
    }
    this.width = this.calcWidth();
  }

  calcWidth() {
    const percent = this.rating*10;
    return percent > 100 ? 100 : percent;
  }

  protected readonly Math = Math;
}

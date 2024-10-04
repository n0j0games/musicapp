import {Component, Input, OnInit} from '@angular/core';
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
export class RatingComponent implements OnInit {

  @Input() rating!: number;

  colors = ["#DF3E23","#FA6A0A","#F9A31B","#FFD541","#FFFC40","#D6F264","#9CDB43","#59C135","#14A02E","#1A7A3E","#862af6"];

  ngOnInit() {
    if (this.rating < 0 || this.rating > 10 ) {
      console.warn("Unexpected rating");
    }
  }

  calcWidth(rating : number) {
    const percent = rating*10;
    return percent > 100 ? 100 : percent;
  }

  protected readonly Math = Math;
}

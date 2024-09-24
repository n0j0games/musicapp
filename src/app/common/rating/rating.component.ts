import {Component, Input, OnInit} from '@angular/core';
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss'
})
export class RatingComponent implements OnInit {

  @Input() rating!: number;

  colors = ["#000000","#DF3E23","#FA6A0A","#F9A31B","#FFD541","#FFFC40","#D6F264","#9CDB43","#59C135","#14A02E","#1A7A3E"];

  ngOnInit() {
    if (this.rating < 0 || this.rating > 10 ) {
      console.warn("Unexpected rating");
    }
  }

}

import {Component, Input} from '@angular/core';
import {Album} from "../../models/album";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-review-button',
  standalone: true,
  imports: [],
  templateUrl: './review-button.component.html',
  styleUrl: './review-button.component.scss'
})
export class ReviewButtonComponent {

  constructor(private router: Router) {}

  @Input() album!: Album;

  routeToReview() {
    this.router.navigate(
        ['/review/' + this.album.review],
        {
          queryParams: {name: this.album.artist + " - " + this.album.title, coverImg: this.album.imgUrl.replaceAll("/", "\\")}
        }
    ).then(res => console.log("Navigated to ", res))
  }

}

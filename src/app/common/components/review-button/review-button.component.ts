import {Component, Input} from '@angular/core';
import {Album} from "../../models/album";
import {Router} from "@angular/router";
import {Logger} from "../../logger";

@Component({
  selector: 'app-review-button',
  standalone: true,
  imports: [],
  templateUrl: './review-button.component.html',
  styleUrl: './review-button.component.scss'
})
export class ReviewButtonComponent {

  private logger: Logger = new Logger(this);

  constructor(private router: Router) {}

  @Input() album!: Album;

  routeToReview() {
    this.router.navigate(
        ['/review/' + this.album.review], {}
    ).then(res => this.logger.debug("Navigated to ", res))
  }

}

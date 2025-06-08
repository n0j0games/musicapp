import {Component, Input, OnInit} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {PlayButtonComponent} from "../../common/components/play-button/play-button.component";
import {RatingComponent} from "../../common/components/rating/rating.component";
import {RemoveDeluxePipe} from "../../common/pipes/remove-deluxe.pipe";
import {RemoveFeatPipe} from "../../common/pipes/remove-feat.pipe";
import {VinylComponent} from "../../common/components/vinyl/vinyl.component";
import {Movie} from "../../common/models/movie";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {AudioService} from "../../common/services/audio.service";
import {ReviewService} from "../../common/services/review.service";
import {NormalizeHelper} from "../../common/normalize-helper";
import {Logger} from "../../common/logger";

@Component({
  selector: 'app-show-detail',
  standalone: true,
  imports: [
    NgIf,
    PlayButtonComponent,
    RatingComponent,
    RemoveDeluxePipe,
    RemoveFeatPipe,
    VinylComponent,
    RouterLink,
    NgClass
  ],
  templateUrl: './show-detail.component.html'
})
export class ShowDetailComponent {

  @Input() movie! : Movie;
  @Input() index! : number;

  private logger: Logger = new Logger(this);

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  routeWithQueryString(query: string) {
    this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams: { q: NormalizeHelper.fromNormalToQueryString(query) },
          queryParamsHandling: 'merge'
        }
    ).then(_ => {this.logger.log("Refreshed params")});
  }

}

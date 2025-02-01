import {Component, Input, OnInit} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {PlayButtonComponent} from "../../common/components/play-button/play-button.component";
import {RatingComponent} from "../../common/components/rating/rating.component";
import {RemoveDeluxePipe} from "../../common/pipes/remove-deluxe.pipe";
import {RemoveFeatPipe} from "../../common/pipes/remove-feat.pipe";
import {VinylComponent} from "../../common/components/vinyl/vinyl.component";
import {Movie} from "../../common/models/movie";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-series-detail',
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
  templateUrl: './series-detail.component.html'
})
export class SeriesDetailComponent {

  @Input() movie! : Movie;
  @Input() index! : number;
  @Input() activeSeason : number | undefined;

}

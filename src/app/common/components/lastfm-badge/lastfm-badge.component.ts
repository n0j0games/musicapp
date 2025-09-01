import {Component, Input} from '@angular/core';
import {NgIf, NgStyle} from "@angular/common";
import {RatingPipe} from "../../pipes/rating.pipe";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-lastfm',
  standalone: true,
  imports: [
    NgIf,
    RatingPipe,
    NgStyle,
    RouterLink
  ],
  templateUrl: './lastfm-badge.component.html',
  styleUrl: './lastfm-badge.component.scss'
})
export class LastfmBadgeComponent {

    @Input() scrobbles!: number;
    @Input() scrobbles30Days!: number | null;
}

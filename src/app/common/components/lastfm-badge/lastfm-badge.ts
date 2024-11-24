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
  templateUrl: './lastfm-badge.html',
  styleUrl: './lastfm-badge.scss'
})
export class LastfmBadge {

    @Input() scrobbles!: number;
    @Input() scrobbles30Days!: number | null;
}

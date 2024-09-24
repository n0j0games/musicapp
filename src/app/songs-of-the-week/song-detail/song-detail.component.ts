import {Component, Input, OnInit} from '@angular/core';
import {Song} from "../../models/song";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {RatingComponent} from "../../common/rating/rating.component";

@Component({
  selector: 'app-song-detail',
  standalone: true,
    imports: [
        NgOptimizedImage,
        RatingComponent,
        NgIf
    ],
  templateUrl: './song-detail.component.html',
  styleUrl: './song-detail.component.scss'
})
export class SongDetailComponent {

    @Input() song! : Song;

}

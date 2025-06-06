import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {LastfmBadge} from "../common/components/lastfm-badge/lastfm-badge";
import {NgIf} from "@angular/common";
import {PlayButtonComponent} from "../common/components/play-button/play-button.component";
import {RatingComponent} from "../common/components/rating/rating.component";
import {RemoveDeluxePipe} from "../common/pipes/remove-deluxe.pipe";
import {RemoveFeatPipe} from "../common/pipes/remove-feat.pipe";
import {VinylComponent} from "../common/components/vinyl/vinyl.component";
import {ActivatedRoute, ActivatedRouteSnapshot} from "@angular/router";
import {ReviewService} from "../common/services/review.service";

@Component({
  selector: 'app-review',
  standalone: true,
    imports: [
        LastfmBadge,
        NgIf,
        PlayButtonComponent,
        RatingComponent,
        RemoveDeluxePipe,
        RemoveFeatPipe,
        VinylComponent
    ],
  templateUrl: './review.component.html'
})
export class ReviewComponent implements OnInit, AfterViewInit {

    @ViewChild('review') reviewEl: ElementRef = new ElementRef(null);

    coverImg : string | undefined;
    name: string | undefined;
    reviewHtml!: string;
    title: string | undefined;

    constructor(private route : ActivatedRoute, private reviewService: ReviewService) {
    }

    ngOnInit(): void {
        const path = this.route.snapshot.paramMap.get("path");
        if (path === undefined || path === null) {
            throw new Error("Invalid path");
        }
        this.name = this.route.snapshot.queryParams["name"];
        this.coverImg = this.route.snapshot.queryParams["coverImg"].replaceAll("\\", "/");

        if (this.name === undefined) {
            this.name = path.split("--")[0].replaceAll("-", " ") + " - " + path.split("--")[1].replaceAll("-", " ");
        }

        const rawReview = this.reviewService.getReview(path);
        const splitted = rawReview.split("\n");
        this.title = splitted[0];
        const remaining = splitted.slice(1, splitted.length - 1);

        this.reviewHtml = remaining.join("<br>").replaceAll("-!--", "<span class='p-b-i'>").replaceAll("---","</span>");
    }

    ngAfterViewInit() {
        this.reviewEl.nativeElement.innerHTML = this.reviewHtml;
    }
}

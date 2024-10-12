import {
  AfterViewInit,
  Component, ElementRef,
  HostListener,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AotyService} from "../services/aoty.service";
import {AotyItem} from "../models/aoty-item";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {SongDetailComponent} from "../songs-of-the-week/song-detail/song-detail.component";
import {AlbumDetailComponent} from "./album-detail/album-detail.component";

@Component({
  selector: 'app-albums-of-the-year',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    SongDetailComponent,
    AlbumDetailComponent,
    NgStyle
  ],
  templateUrl: './albums-of-the-year.component.html',
  styleUrls: ['./albums-of-the-year.component.scss']
})
export class AlbumsOfTheYearComponent implements OnInit, AfterViewInit {

  activeYear : number = 0;
  thisYear = new Date().getFullYear();
  showBad = false;
  albumsOfTheYear! : AotyItem | null;

  testTextColors = [
    "#ffffff",
    "#b7ff22",
    "#b18383",
    "#b19883",
    "#30b1da",
    "#eabe21",
    "#d3bfb1"
  ]

  testBackColors = [
    "#707070",
    "#528328",
    "#8f2a2a",
    "#784927",
    "#204478",
    "#38835e",
    "#774017"
  ]

  constructor(private route: ActivatedRoute, private router: Router, private aotyService : AotyService) {}

  ngOnInit(): void {
    const year = this.route.snapshot.paramMap.get('year');
    if (year === undefined || year === null) {
      this.router.navigate(['**']).then(() => console.error("Undefined year, routed to 404"));
      return;
    }
    this.activeYear = <number><unknown>year;

    this.albumsOfTheYear = this.aotyService.getAlbumsOfTheYear(this.activeYear);
    if (this.albumsOfTheYear == null) {
      this.router.navigate(['**']).then(() => console.error("Empty year, routed to 404"));
      return;
    }
    this.albumsOfTheYear.albums = this.albumsOfTheYear.albums.sort((a, b) => b.rating - a.rating).filter(value => value.rating > 4);
  }

  toggleShowBad() {
    this.showBad = !this.showBad;
  }

  /**
   * SCROLL
   */

  @ViewChildren('page') pages!: QueryList<ElementRef>;
  @ViewChild('prev') prev!: ElementRef;
  @ViewChild('next') next!: ElementRef;

  idlePeriod = 100;
  animationDuration = 500;
  lastAnimation = 0;
  index = 0;

  backgrounds = ["#655555", "#43d550", "#259bbf"]

  togglePageContent(index : any, state : any) {
    if (state === 'show') {
      this.pages
          .toArray()
          [index].nativeElement.querySelector('.scroll-element')
          .classList.add('show');
      console.log(this.pages.toArray()[index])
    } else {
      this.pages
          .toArray()
          [index].nativeElement.querySelector('.scroll-element')
          .classList.remove('show');
    }
  }

  ngAfterViewInit() {
    this.togglePageContent(0, 'show');
  }

  clickPrev() {
    if (this.index < 1) return;
    this.togglePageContent(this.index, 'hide');
    this.index--;
    this.pages.forEach((page, i) => {
      if (i === this.index) {
        this.togglePageContent(i, 'show');
        page.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  clickNext() {
    if (this.index >= this.albumsOfTheYear!.albums.length) return;
    this.togglePageContent(this.index, 'hide');
    this.index++;
    this.pages.forEach((page, i) => {
      if (i === this.index) {
        this.togglePageContent(i, 'show');
        page.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  @HostListener('wheel', ['$event'])
  onMouseWheel(event: WheelEvent) {
    let delta = 0;
    if (event.deltaY) {
      delta = -event.deltaY;
    }
    const timeNow = new Date().getTime();

    if (
        timeNow - this.lastAnimation <
        this.idlePeriod + this.animationDuration
    ) {
      event.preventDefault();
      return;
    }

    if (delta < 0) {
      this.next.nativeElement.click();
    } else {
      this.prev.nativeElement.click();
    }

    this.lastAnimation = timeNow;
  }

}

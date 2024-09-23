import {Component, OnInit} from '@angular/core';
import {SotwService} from "../services/sotw-service";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  sotwList : any;

  constructor(private sotwService: SotwService) {}

  ngOnInit() {
    this.sotwList = this.sotwService.getSotwList().items;
    this.sotwService.sotwListChanged$.subscribe({
      next: (v) => this.sotwList = v.items,
      error: (e) => console.log(e)
    })
  }

}

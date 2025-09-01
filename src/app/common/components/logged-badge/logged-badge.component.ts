import {Component, Input, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-logged-badge',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './logged-badge.component.html',
  styleUrl: './logged-badge.component.scss'
})
export class LoggedBadgeComponent implements OnInit {

  @Input()
  rawDate!: string;

  date: string | undefined;

  ngOnInit() {
    this.date = this.formatToGerman(this.rawDate);
  }

  private formatToGerman(dateStr: string): string {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(date);
  }

}

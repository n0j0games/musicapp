import {Component, Input} from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-highlight-card',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './highlight-card.component.html'
})
export class HighlightCardComponent {

  @Input() outerStyle!: any;

  @Input() thumbnailSrc!: string;

  @Input() innerStyle!: any;

  @Input() href!: string;

}

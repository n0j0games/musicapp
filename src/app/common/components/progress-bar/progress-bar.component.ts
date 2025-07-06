import {Component, Input} from '@angular/core';
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent {

  @Input() text!: string;
  @Input() backgroundColor!: string;
  @Input() width!: number;
}

import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-vinyl',
  standalone: true,
    imports: [
        NgIf
    ],
  templateUrl: './vinyl.component.html',
  styleUrl: './vinyl.component.scss'
})
export class VinylComponent {

  @Input() wishlisted! : boolean;

}

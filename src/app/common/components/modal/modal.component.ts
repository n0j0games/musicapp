import {Component} from '@angular/core';
import {NgClass, NgIf, NgStyle} from "@angular/common";

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    NgIf,
    NgStyle,
    NgClass
  ],
  templateUrl: './modal.component.html'
})
export class ModalComponent {

  public isOpen: boolean = false;

}

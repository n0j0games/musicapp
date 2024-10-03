import {Component, Input} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {ItemComponent} from "./item/item.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-item-group',
  standalone: true,
  imports: [
    NgForOf,
    ItemComponent,
    NgIf,
    RouterLink
  ],
  templateUrl: './item-group.component.html',
  styleUrl: './item-group.component.scss'
})
export class ItemGroupComponent {

  @Input() items!: { year : number, week? : number, preview? : string[] }[];
  @Input() decade!: number;

}

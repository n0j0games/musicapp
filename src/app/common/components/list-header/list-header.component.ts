import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {Sorting} from "../../models/sorting.enum";
import {Option} from "../../models/option";

@Component({
  selector: 'app-list-header',
  standalone: true,
    imports: [
        FormsModule,
        NgForOf,
        ReactiveFormsModule
    ],
  templateUrl: './list-header.component.html'
})
export class ListHeaderComponent {

    @Output()
    onFormChanges: EventEmitter<void> = new EventEmitter();

    @Output()
    onFormReset: EventEmitter<void> = new EventEmitter();

    @Output()
    onItemReset: EventEmitter<string> = new EventEmitter();

    @Input()
    formGroup!: FormGroup;

    @Input()
    yearOptions! : number[];

    @Input()
    decadeOptions! : number[];

    @Input()
    sortingOptions! : Sorting[];

    @Input()
    title!: string;

    @Input()
    subtitle!: string;

    submitForm(event: any) {
        this.onFormChanges.emit(event);
    }

    resetForm(event: any) {
        this.onFormReset.emit(event);
    }

    resetItem(name: string) {
        this.onItemReset.emit(name);
    }

    compareFn(o1: any, o2: any): boolean { return o1 === o2 && o1.value === o2.value }

}

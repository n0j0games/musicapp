import {Component, OnInit} from '@angular/core';
import {ItemComponent} from "../item-group/item/item.component";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home-special',
  standalone: true,
    imports: [
        ItemComponent,
        ReactiveFormsModule
    ],
  templateUrl: './home-special.component.html'
})
export class HomeSpecialComponent implements OnInit {

    formGroup! : FormGroup;

    constructor(private router: Router) {}

    ngOnInit() {
        this.formGroup = new FormGroup({
            artistSearch : new FormControl('')
        });
    }

    submitForm() {
        const value: string | null = this.formGroup.get("artistSearch")?.value;
        if (value === null) {
            return;
        }
        let param = value.replaceAll(" ", "-").toLowerCase();
        let queryParam = {}
        if (param.startsWith('"') && param.endsWith('"')) {
            param = param.replaceAll('"', '');
            queryParam = { type : "strict" }
        }
        this.router.navigate(['/lists/' + param], { queryParams : queryParam}).then(() => console.log("Searching for artist"));
        console.log(value);
    }

}

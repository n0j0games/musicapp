import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {PermissionService} from "../../services/permission.service";

@Component({
  selector: 'app-permission-dialogue',
  standalone: true,
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './permission-dialogue.component.html',
  styleUrl: './permission-dialogue.component.scss'
})
export class PermissionDialogueComponent implements OnInit {

  @ViewChild('loginDialog') dialogRef!: ElementRef<HTMLDialogElement>;

  form = new FormGroup({
    mail: new FormControl('', { nonNullable: true, validators: Validators.required }),
    password: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });

  private loginDialogService = inject(PermissionService);

  ngOnInit(): void {
    this.loginDialogService.onOpenRequested().subscribe(() => {
      this.form.reset();
      this.dialogRef.nativeElement.showModal();
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.dialogRef.nativeElement.close();
    this.loginDialogService.resolve(this.form.getRawValue());
  }

  cancel(): void {
    this.dialogRef.nativeElement.close();
    this.loginDialogService.cancelled();
  }

}

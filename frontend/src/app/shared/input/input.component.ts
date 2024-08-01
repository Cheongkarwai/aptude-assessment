import {Component, Input} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    CommonModule,
    MatFormField,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent {

  @Input()
  label: string = '';

  @Input()
  control: FormControl<string | null> = new FormControl<string | null>('');

  @Input()
  placeholder:string = '';
}

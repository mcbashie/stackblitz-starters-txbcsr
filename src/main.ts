import 'zone.js/dist/zone';
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { DropDownItem } from './dropdown.model';
import { SelectComponent } from './select.component';
import { AppModule } from './app.module';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule],
  template: `
  <app-select title="Title" [disabled]="!isOpen" [options]="calamityOptions" [selectedOption]=""
  [showSearchField]="false">
  </app-select>
  `,
})
export class App implements OnInit {
  name = 'Angular';
  public isOpen: boolean;
  chosenOption = '';
  calamityOptions: Array<DropDownItem> = [];

  constructor() {
    this.isOpen = false;
  }

  ngOnInit(): void {
    this.calamityOptions.unshift({
      viewValue: 'A',
      value: 'A',
      valueCode: 'A',
    });

    this.calamityOptions.unshift({
      viewValue: 'B',
      value: 'B',
      valueCode: 'B',
    });

    this.calamityOptions.unshift({
      viewValue: '-',
      value: '',
      valueCode: '',
    });
  }
}

bootstrapApplication(AppModule);

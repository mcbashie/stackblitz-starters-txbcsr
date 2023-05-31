import 'zone.js/dist/zone';
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule],
  template: `
  <app-select title="ATW art 2.5" [disabled]="!isOpen" [options]="calamityOptions" [selectedOption]=""
  (selectionChange)="selectedCalamityChanged($event)" [showSearchField]="false">
  </app-select>
  `,
})
export class App implements OnInit {
  name = 'Angular';
  public isOpen: boolean;
  chosenOption = '';
  calamityOptions = [];

  constructor() {
    this.isOpen = false;
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

  selectedCalamityChanged(event): void {
    this.chosenOption = event;
  }
}

bootstrapApplication(App);

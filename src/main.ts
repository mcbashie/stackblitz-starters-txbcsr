import 'zone.js/dist/zone';
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { DropDownItem } from './dropdown.model';
import { SelectComponent } from './select.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
   declarations: [ 
     SelectComponent
   ],
  imports: [
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatRadioModule,
  ],
  providers: [] });
  

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

bootstrapApplication(App);

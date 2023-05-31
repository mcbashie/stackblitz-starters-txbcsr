import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
})
export class SelectComponent implements OnInit, OnChanges {
  @Input() disabled = false;
  @Input() title: any;
  @Input() options = [];
  @Input() selectedOption: string | undefined;
  @Input() showSearchField = true;
  @Output() selectionChange = new EventEmitter();
  open: boolean = false;
  appselect: UntypedFormControl = new UntypedFormControl();
  tempOptions = [];
  searchText = '';
  firstload = true;
  constructor() {}
  //when angular gets the data or the selected changes this will fill it
  ngOnChanges(): void {
    //filling data on first time
    if (this.firstload) {
      this.tempOptions = [...this.options];
      this.firstload = false;
    }
    this.appselect.setValue(this.selectedOption);
  }

  ngOnInit(): void {
    this.appselect.setValue(this.selectedOption);
    this.appselect.markAsTouched();
    this.appselect.updateValueAndValidity();
  }
  //if something gets selected
  selectionChangedTrigger($event: { value: string }): void {
    this.selectedOption = $event.value;
    this.selectionChange.emit($event.value);
  }
  //search when key is pressed but not when arrows are used.
  onKeyUp(event: { target: { value: string }; code: string | string[] }): void {
    this.searchText = event.target.value;
    if (event.code == 'ArrowDown' || event.code == 'ArrowUp') {
      //to stop selecting the search field for special read software
      var elements = document.querySelectorAll(
        'mat-option.mat-focus-indicator.ng-star-inserted'
      ) as NodeListOf<HTMLElement>;

      for (var i = 0; i < elements.length; i++) {
        elements[i].blur();
      }
      (
        document.querySelector(
          'mat-option.mat-focus-indicator.ng-star-inserted.mat-active'
        ) as HTMLElement
      ).focus();
    }
  }
}

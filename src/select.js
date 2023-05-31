import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { UntypedFormControl, ValidatorFn, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, scan } from 'rxjs/operators';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('input') inputEl: ElementRef;
  @Input() disabled = false;
  @Input() title;
  @Input() options = [];
  @Input() selectedOption :string;
  @Input() lazyload = true;
  @Input() validationRules: ValidatorFn[];
  @Input() invalidMessages: InvalidMessage[];
  @Input() showSearchField = true;
  @Output() selectionChange = new EventEmitter();
  open: boolean = false;
  appselect: UntypedFormControl = new UntypedFormControl();
  tempOptions = [];
  searchText = '';
  safetheselected=[];
  firstload = true;
  limit = 200;
  offset = 0;
  addselected = false;
  valuetracker = new BehaviorSubject<string[]>([]);
  values$: Observable<string[]>;
  scrollhotkey: Hotkey;
  constructor(private hotkeysService: HotkeysService) {
    this.createobservable();
    if(this.hotkeysService.hotkeys.find(e => e.combo == 'alt+s' && e.description == 'Selecteer het zoekveld') == null){
      this.hotkeysService.add(new Hotkey('alt+s', (event: KeyboardEvent): boolean => {
        let elementReference = document.querySelector('.mat-select-search');
        if (elementReference instanceof HTMLElement) {
            elementReference.focus();
        }
        return false; // Prevent bubbling
      },['INPUT', 'SELECT', 'TEXTAREA'], 'Selecteer het zoekveld'));
    }
    //select correct row for jaws.
    this.scrollhotkey = new Hotkey(['up','down'], (event: KeyboardEvent, combo: string): boolean => {
      if(this.open){
        (document.querySelector('mat-option.mat-focus-indicator.ng-star-inserted.mat-active') as HTMLElement).focus();
      }
      return false; // Prevent bubbling
    });
    this.hotkeysService.add(this.scrollhotkey);
    this.hotkeysService.pause(this.scrollhotkey);
  }
  ngOnDestroy() {
    let temphot = this.hotkeysService.hotkeys.find(e => e.description == 'Selecteer het zoekveld');
    if(temphot)this.hotkeysService.remove(temphot); 
  }
  //makes it so that values is uptodate and can be emptyed
  //safetheselected keeps track of everything in the visable list. so that we can check what is in it.
  createobservable(empty = false){
    if(empty){
    this.values$ = new BehaviorSubject<string[]>([]).asObservable();
    this.safetheselected = [];
    }
    this.values$ = this.valuetracker.asObservable().pipe(
      scan((acc, newinput) => {//newinput is new input acc is old
        //this makes it so that if it wants to add one value when 
        if(newinput.length==1 && this.addselected){
          this.safetheselected = this.safetheselected.concat(newinput);
          this.addselected = false;
          return [...newinput, ...acc];
        }
        else{
          this.safetheselected = this.safetheselected.concat(newinput);
          return [...acc, ...newinput];
        }
      }, [])
  );
  }
  //when angular gets the data or the selected changes this will fill it
  ngOnChanges(): void {
    this.fillTempOptions(this.searchText);
    //filling data on first time
    if(this.firstload){
      if(!this.lazyload) this.tempOptions = [...this.options];
      this.firstload = false;
    }
    this.appselect.setValue(this.selectedOption);
  } 

  ngOnInit(): void {
          this.limit = 20;
    );

    this.appselect.setValidators(this.validationRules);
    this.appselect.setValue(this.selectedOption);
    this.appselect.markAsTouched();
    this.appselect.updateValueAndValidity();
  }
  //tracks open and closing of select.
  openChanged($event){
    this.open = $event;
    //onclose - adds/selects selected item to the top of the list if it's not in the list when closing. so it shows on the outside
    if($event==false){
      this.hotkeysService.pause(this.scrollhotkey);
      //if selected is not in the tempoptions due to searching add it back so it shows.
      if(this.tempOptions.find(e => e.value == this.selectedOption)==null && this.selectedOption){
        this.tempOptions.unshift(this.options.find(e => e.value == this.selectedOption));
      }
      //add selected value if it's not in the select shown list and selects it
      if(this.lazyload && !this.safetheselected.find(e => e.value == this.selectedOption) && this.selectedOption && this.tempOptions.find(e => e.value == this.selectedOption)!=null){
        let result= [this.tempOptions.find(e => e.value == this.selectedOption)];
        this.addselected = true;
        this.valuetracker.next(result);
      }
      else if(this.lazyload && this.safetheselected[0] != this.tempOptions[0] && this.safetheselected[0].value != this.selectedOption){
        this.getNextBatch(false,true);
      }
      //always reselects the file in the end because we deselected when adding more else it will focus on the selected instead of the one already selected.
      if(this.lazyload){
        this.appselect.setValue(this.selectedOption);
      }
    }
    else{//on open focus on search field
      this.hotkeysService.unpause(this.scrollhotkey);
      let elementReference = document.querySelector('.searchselect .mat-select-search');
      if (elementReference instanceof HTMLElement) {
          elementReference.focus();
      }
    }
  }
  //get called when needs more input. justload false means it will reset if it's false the offset needs to be set to 0 or
  //refresh needs to be set true to reload all the old data back in the select.
  getNextBatch(justload=true, refresh=false) {
    let result;
    if(refresh){
      result = this.tempOptions.slice(0, this.offset + this.limit);
    }
    else{
      result = this.tempOptions.slice(this.offset, this.offset + this.limit);
    }
    //if it will add the selected value if it would not be shown because it's not in the result list
    //else if at start of the website if something is selected make sure it's added to the result.
    if( this.selectedOption && result.find(e=>e.value == this.selectedOption)==null && (!justload && !this.firstload || this.safetheselected && this.safetheselected.length>0 && (!this.safetheselected.find(e=>e.value == this.selectedOption)))
        && this.tempOptions.find(e=>e.value == this.selectedOption)){​​​​​​​​
      result.unshift(this.tempOptions.find(e => e.value == this.selectedOption));
    }
    else if(this.firstload && this.selectedOption && this.tempOptions.find(e => e.value == this.selectedOption)!=null && result.find(e=>e.value == this.selectedOption)==null){
      result.unshift(this.tempOptions.find(e => e.value == this.selectedOption));
    }
    if(justload==false) this.createobservable(true);
    //when scrolling unselect item that is selected else it will focus on that(in the background it is still selected just not for the browsers perspective)
    if(this.offset!=0)this.appselect.setValue(null);
    //loads info in
    this.valuetracker.next(result);
    if(!justload)this.appselect.setValue(this.selectedOption);
    if(this.tempOptions.length>0)this.offset += this.limit;
  }
  //used to reset the select for when searching and old select needs to be removed.
  resetoffset(){
    //enable for inifinite scroll
    if(this.lazyload){
      this.offset = 0;
      this.getNextBatch(false);
    }
  }
  //show error if any.
  getErrorMessage() {
    let errorMessage = "";
    if (this.invalidMessages) {
      this.invalidMessages.forEach((invalidMessage) => {
        if (
          this.appselect.errors &&
          this.appselect.errors[invalidMessage.validationRule]
        ) {
          if (errorMessage === "") {
            errorMessage += invalidMessage.validationMessage;
          } else {
            errorMessage += ", " + invalidMessage.validationMessage;
          }
        }
      });
    }
    return errorMessage;
  }
  //if something gets selected
  selectionChangedTrigger($event): void {
    this.selectedOption = $event.value;
    this.selectionChange.emit($event.value);
  }
  //search when key is pressed but not when arrows are used.
  onKeyUp(event): void {
    this.searchText = event.target.value;
    if(!event.code.includes("Arrow"))this.fillTempOptions(event.target.value);
    else if(event.code=="ArrowDown" || event.code=="ArrowUp"){
      //to stop selecting the search field for special read software
      var elements = (document.querySelectorAll("mat-option.mat-focus-indicator.ng-star-inserted") as NodeListOf<HTMLElement>);

      for(var i = 0; i < elements.length; i++){
        elements[i].blur();
      }
      (document.querySelector('mat-option.mat-focus-indicator.ng-star-inserted.mat-active') as HTMLElement).focus();
  }
  }
  //the search engine takes what it can find and put it in tempoptions. this function is always used.
  fillTempOptions(searchValue: string) : void {
    let oldoptions = this.tempOptions;
    this.tempOptions = this.options.filter(item => {
      return item.viewValue.toLowerCase().includes(searchValue.toLowerCase());
    }).sort();
    
    if (this.tempOptions.length < 1) {
      if(this.selectedOption){
        let tempval = this.options.find(e => e.value == this.selectedOption);
        if(tempval)this.tempOptions = [tempval];
      }

      //if there is a 'Alle' option still show it when searching
      if(this.options.find(e => e.value == 'Alle') && !this.tempOptions.find(e => e.value == 'Alle')){
        this.tempOptions.unshift(this.options.find(e => e.value == 'Alle'));
      }
      //if there is a - still show it when searching
      //else if there is no option selected and input field isn't required still show -
      if(this.options.find(e => e.viewValue == '-') && !this.tempOptions.find(e => e.viewValue == '-')){
        this.tempOptions.unshift(this.options.find(e => e.viewValue == '-'));
      }
      else if(!this.selectedOption || this.validationRules==null || !this.validationRules.includes(Validators.required)){
        this.tempOptions.unshift(
          {
            viewValue: '-'
          }
        );
      }
    }
    //check if array is different if so the list will be reset
    if((!this.arraysEqual(oldoptions,this.tempOptions)) || this.firstload){this.resetoffset();}
  }
  //check if arrays are equal
  arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }


  clickSelect(): void {
    this.inputEl.nativeElement.focus();
    if (this.searchText) {
      this.fillTempOptions(this.searchText);
    }
  }

}


import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {

  isAddEventClickedValue: boolean;
  get isAddEventClicked(): boolean {
    return this.isAddEventClickedValue;
  }
  @Input() set isAddEventClicked(value: boolean) {
    this.isAddEventClickedValue = value;
    this.isAddEventClickedChange.emit(this.isAddEventClickedValue);
  }

  @Output() isAddEventClickedChange = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

}

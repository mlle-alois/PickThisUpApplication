import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {

  _isAddEventClicked: boolean;
  get isAddEventClicked(): boolean {
    return this._isAddEventClicked;
  }
  @Input() set isAddEventClicked(value: boolean) {
    this._isAddEventClicked = value;
    this.isAddEventClickedChange.emit(this._isAddEventClicked);
  }

  @Output() isAddEventClickedChange = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

}

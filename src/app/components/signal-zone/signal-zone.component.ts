import {Component, Input, OnInit, Output} from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-signal-zone',
  templateUrl: './signal-zone.component.html',
  styleUrls: ['./signal-zone.component.css']
})
export class SignalZoneComponent implements OnInit {

  _isSignalZoneClicked: boolean;
  get isSignalZoneClicked(): boolean {
    return this._isSignalZoneClicked;
  }
  @Input() set isSignalZoneClicked(value: boolean) {
    this._isSignalZoneClicked = value;
    this.isSignalZoneClickedChange.emit(this._isSignalZoneClicked);
  }

  @Output() isSignalZoneClickedChange = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit(): void {
  }

}

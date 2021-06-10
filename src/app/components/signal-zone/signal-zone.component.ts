import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-signal-zone',
  templateUrl: './signal-zone.component.html',
  styleUrls: ['./signal-zone.component.css']
})
export class SignalZoneComponent implements OnInit {

  @Input() isSignalZoneClicked: boolean;
  //TODO faire circuler l'info entre parent et enfant avec get et set

  constructor() {
  }

  ngOnInit(): void {
  }

}

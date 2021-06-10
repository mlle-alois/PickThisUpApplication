import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {

  @Input() isAddEventClicked: boolean;
  //TODO faire circuler l'info entre parent et enfant avec get et set

  constructor() { }

  ngOnInit(): void {
  }

}

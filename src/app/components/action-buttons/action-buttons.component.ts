import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-action-buttons',
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.css']
})
export class ActionButtonsComponent implements OnInit {

  @Input() token: string;

  constructor() { }

  ngOnInit(): void {
  }

}

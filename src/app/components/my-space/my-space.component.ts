import { Component, OnInit } from '@angular/core';
import {UserModel} from '../../models/user.model';
import {EventModel} from '../../models/event.model';
import {MyDate} from '../../utils/MyDate';
import {CarpoolModel} from '../../models/carpool.model';
import {MediaModel} from '../../models/media.model';


@Component({
  selector: 'app-my-space',
  templateUrl: './my-space.component.html',
  styleUrls: ['./my-space.component.css']
})
export class MySpaceComponent implements OnInit {
  token: string;
  currentUser: UserModel;

  events: EventModel[] = [];
  currentTimestamp: MyDate;

  isEventDetailVisible = false;
  visibleEvent: EventModel;
  eventParticipants: UserModel[];
  currentUserParticipateToEvents: Map<number, boolean>;

  eventCarpools: CarpoolModel[];
  carpoolParticipants: UserModel[];
  currentUserParticipateToCarpools: Map<number, boolean>;
  currentUserParticipateToCarpool = false;

  isCarpoolDetailVisible = false;
  visibleCarpool: CarpoolModel;

  eventPictures: MediaModel[];

  constructor() { }


  ngOnInit(): void {
  }




}

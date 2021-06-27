import {Component, Input, OnInit} from '@angular/core';
import {EventModel} from "../../models/event.model";
import {MyDate} from "../../utils/MyDate";
import {DateUtils} from "../../utils/DateUtils";
import {CarpoolModel} from "../../models/carpool.model";
import {MediaModel} from "../../models/media.model";
import {UserModel} from "../../models/user.model";
import {CarpoolService} from "../../services/carpool.service";
import {ZoneService} from "../../services/zone.service";
import {EventService} from "../../services/event.service";

@Component({
  selector: 'app-my-event',
  templateUrl: './my-event.component.html',
  styleUrls: ['./my-event.component.css']
})
export class MyEventComponent implements OnInit {

  @Input() event: EventModel;

  currentTimestamp: MyDate;

  isEventDetailVisible = false;
  visibleEvent: EventModel;
  eventParticipants: UserModel[];

  eventCarpools: CarpoolModel[];
  carpoolParticipants: UserModel[];

  isCarpoolDetailVisible = false;
  visibleCarpool: CarpoolModel;

  eventPictures: MediaModel[];

  isUpdateEventClicked = false;

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];
  constructor(
    private eventService: EventService,
    private carpoolService: CarpoolService,
    private zoneService: ZoneService) { }

  ngOnInit(): void {
    this.currentTimestamp = DateUtils.getCurrentDate();
  }

  async onEventDetailClicked(event: EventModel): Promise<void> {
    this.isEventDetailVisible = true;
    this.visibleEvent = event;
    this.eventParticipants = await this.getParticipantsOfEvent(event);
    this.eventCarpools = await this.getCarpoolsOfEvent(event);
    this.eventPictures = [];
    this.eventPictures = await this.getPicturesOfEvent(event);
  }

  async onEventUpdateClicked(event: EventModel): Promise<void> {
    this.isUpdateEventClicked = true;
    this.visibleEvent = event;
    this.eventPictures = [];
    this.eventPictures = await this.getPicturesOfEvent(event);
  }

  getCarpoolsOfEvent(event: EventModel): Promise<CarpoolModel[]> {
    return this.carpoolService.getCarpoolsEvent(event.eventId)
      .then(function(carpools) {
        return carpools;
      });
  }

  getPicturesOfEvent(event: EventModel): Promise<MediaModel[]> {
    return this.zoneService.getPicturesZone(event.zone.zoneId)
      .then(function(pictures) {
        return pictures;
      });
  }

  getParticipantsOfEvent(event: EventModel): Promise<UserModel[]> {
    return this.eventService.getParticipantsEvents(event.eventId)
      .then(function(users) {
        return users;
      });
  }

  getParticipantsOfCarpool(carpool: CarpoolModel): Promise<UserModel[]> {
    return this.carpoolService.getCarpoolParticipants(carpool.carpoolId)
      .then(function(users) {
        return users;
      });
  }

  async onCarpoolDetailClicked(carpool: CarpoolModel): Promise<void> {
    this.isCarpoolDetailVisible = true;
    this.visibleCarpool = carpool;
    this.carpoolParticipants = await this.getParticipantsOfCarpool(carpool);
  }

}

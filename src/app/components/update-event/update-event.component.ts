import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ZoneModel} from "../../models/zone.model";
import {EventService} from "../../services/event.service";
import {ZoneService} from "../../services/zone.service";
import {MessageService} from "primeng/api";
import {DateUtils} from "../../utils/DateUtils";
import {EventModel} from "../../models/event.model";

@Component({
  selector: 'app-update-event',
  templateUrl: './update-event.component.html',
  styleUrls: ['./update-event.component.css']
})
export class UpdateEventComponent implements OnInit {

  isAddEventClickedValue: boolean;
  get isUpdateEventClicked(): boolean {
    return this.isAddEventClickedValue;
  }

  @Input() set isUpdateEventClicked(value: boolean) {
    this.isAddEventClickedValue = value;
    this.isUpdateEventClickedChange.emit(this.isAddEventClickedValue);
  }
  @Output() isUpdateEventClickedChange = new EventEmitter<boolean>();

  visibleEventValue: EventModel;
  get visibleEvent(): EventModel {
    return this.visibleEventValue;
  }

  @Input() set visibleEvent(value: EventModel) {
    this.visibleEventValue = value;
    this.visibleEventChange.emit(this.visibleEventValue);
  }
  @Output() visibleEventChange = new EventEmitter<EventModel>();


  filteredItems: any[];
  pollutionLevelItems: any[] = ['Faible', 'Moyen', 'Elevé'];

  registerForm: FormGroup;
  loading = "";

  availableZones: ZoneModel[];
  zones = [];
  selectedZone: ZoneModel;
  selectedZonePictures = [];
  eventPicture: any;

  constructor(private fb: FormBuilder,
              private eventService: EventService,
              private zoneService: ZoneService,
              private messageService: MessageService) {
    this.registerForm = this.fb.group({
      'zoneId': ['', Validators.required],
      'eventTitle': ['', Validators.required],
      'eventDescription': ['', Validators.required],
      'dateHourStart': ['', Validators.required],
      'dateHourEnd': ['', Validators.required],
      'eventMaxNbPlaces': ['', [Validators.pattern('[1-9]{1}[0-9]*'), Validators.required]],
      'eventPitureId': ['', Validators.required]
    });
  }

  async ngOnInit() {
    await this.initAvailableZones();
  }

  async initAvailableZones() {
    this.availableZones = await this.zoneService.getAvailableZones();
    this.availableZones.forEach((zone) => {
      this.zones.push({adress: zone.zoneStreet + " " + zone.zoneZipcode + " " + zone.zoneCity, zone: zone})
    });
  }

  async createEvent() {
    this.loading = "chargement...";
    if(this.registerForm.value['dateHourStart'] >= this.registerForm.value['dateHourEnd']) {
      this.messageService.add({severity: 'warn', summary: 'Conflit', detail: 'Veuillez saisir une date de début précédant la date de fin'});
      this.loading = "";
      return;
    }
    if(this.registerForm.value['dateHourStart'] <= DateUtils.getCurrentDate()) {
      this.messageService.add({severity: 'warn', summary: 'Conflit', detail: 'Veuillez saisir une date de début supérieure à la date actuelle'});
      this.loading = "";
      return;
    }
    await this.eventService.createEvent(this.registerForm.value, this.selectedZone);
    this.loading = "";
    this.isUpdateEventClickedChange.emit(false);
    this.messageService.add({severity: 'info', summary: 'Créé', detail: 'L\'événement a été créé ! Il doit désormais être validé par notre équipe.'});
  }

  filterItems(event) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < this.pollutionLevelItems.length; i++) {
      let item = this.pollutionLevelItems[i];
      if (item.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(item);
      }
    }

    this.filteredItems = filtered;
  }

  async onSelectZone(event) {
    this.selectedZone = event.value.zone;
    this.selectedZonePictures = (await this.zoneService.getPicturesZone(this.selectedZone.zoneId)).map(function (picture) {
      return {path: picture.mediaPath, pictureId: picture.mediaId};
    });
  }
}

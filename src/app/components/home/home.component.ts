import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticatedUserService} from "../../services/authenticated-user.service";
import {EventModel} from "../../models/event.model";
import {EventService} from "../../services/event.service";
import {DateUtils} from "../../utils/DateUtils";
import {MyDate} from "../../utils/MyDate";
import {UserModel} from "../../models/user.model";
import {CarpoolModel} from "../../models/carpool.model";
import {CarpoolService} from "../../services/carpool.service";
import {MediaModel} from "../../models/media.model";
import {ZoneService} from "../../services/zone.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnInit {
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

  isProposeCarpool = false;

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

  registerForm: FormGroup;
  message: any;
  loading = "";
  selectedEvent: EventModel;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private authenticatedUserService: AuthenticatedUserService,
              private eventService: EventService,
              private carpoolService: CarpoolService,
              private zoneService: ZoneService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) {
    this.registerForm = this.formBuilder.group({
      'carpoolDepartureStreet': ['', Validators.required],
      'carpoolDepartureCity': ['', Validators.required],
      'carpoolDepartureZipcode': ['', [Validators.pattern('[0-9]{5}'), Validators.required]],
      'nbPlaces': ['', [Validators.pattern('[1-9]{1}[0-9]*'), Validators.required]]
    });
  }

  async ngOnInit() {
    this.initToken();
    await this.initCurrentUser();
    /*if (this.currentUser === null || this.currentUser === undefined) {
      this.authenticatedUserService.loadCurrentUser().then(async () => {
        await this.initCurrentUser();
        window.location.reload();
      });
    }*/
  }

  async ngAfterViewInit() {
    if (!this.authenticatedUserService.isAuthenticated()) {
      this.authenticatedUserService.redirectToAuthentication();
    }
    this.events = await this.eventService.getAvailableEvents();
    this.currentTimestamp = DateUtils.getCurrentDate();
    this.currentUserParticipateToEvents = await this.setCurrentUserParticipateToEvents(this.events);
  }

  initToken() {
    this.token = this.authenticatedUserService.getToken();
  }

  async initCurrentUser() {
    this.currentUser = await this.authenticatedUserService.getCurrentUser();
  }

  async onEventDetailClicked(event: EventModel): Promise<void> {
    this.isEventDetailVisible = true;
    this.visibleEvent = event;
    this.eventParticipants = await this.getParticipantsOfEvent(event);
    this.eventCarpools = await this.getCarpoolsOfEvent(event);
    this.currentUserParticipateToCarpools = await this.setCurrentUserParticipateToCarpools(this.eventCarpools);
    this.eventPictures = await this.getPicturesOfEvent(event);
  }

  async onCarpoolDetailClicked(carpool: CarpoolModel): Promise<void> {
    this.isCarpoolDetailVisible = true;
    this.visibleCarpool = carpool;
    this.carpoolParticipants = await this.getParticipantsOfCarpool(carpool);
  }

  getParticipantsOfEvent(event: EventModel): Promise<UserModel[]> {
    return this.eventService.getParticipantsEvents(event.eventId)
      .then(function (users) {
        return users;
      });
  }

  getParticipantsOfCarpool(carpool: CarpoolModel): Promise<UserModel[]> {
    return this.carpoolService.getCarpoolParticipants(carpool.carpoolId)
      .then(function (users) {
        return users;
      });
  }

  getCarpoolsOfEvent(event: EventModel): Promise<CarpoolModel[]> {
    return this.carpoolService.getCarpoolsEvent(event.eventId)
      .then(function (carpools) {
        return carpools;
      });
  }

  getPicturesOfEvent(event: EventModel): Promise<MediaModel[]> {
    return this.zoneService.getPicturesZone(event.zone.zoneId)
      .then(function (pictures) {
        return pictures;
      });
  }

  async proposeCarpool(event: EventModel, e: Event) {
    this.confirmationService.confirm({
      target: e.target,
      message: 'Voulez-vous proposer un covoiturage pour cet événement ?',
      icon: 'pi pi-users',
      accept: async () => {
        this.selectedEvent = event;
        this.isProposeCarpool = true;
      },
      reject: async () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Pas de covoiturage proposé',
          detail: 'Si vous changez d\'avis, il faudra vous désincrire de l\'événement et vous réinscrire'
        });
        await this.participateToEvent(event);
      }
    });
  }

  async createCarpool() {
    this.carpoolService.proposeCarpool(this.registerForm.value, this.selectedEvent);
    this.messageService.add({severity: 'info', summary: 'Créé', detail: 'Covoiturage proposé'});
    this.isProposeCarpool = false;
    await this.participateToEvent(this.selectedEvent);
  }

  async participateToEvent(event: EventModel) {
    this.eventParticipants = await this.eventService.registerToEvent(event.eventId);
    this.events = await this.eventService.getAvailableEvents();
    this.currentUserParticipateToEvents = await this.setCurrentUserParticipateToEvents(this.events);
    this.visibleEvent = this.events.find(event => event.eventId === event.eventId);
    this.messageService.add({severity: 'info', summary: 'Inscrit', detail: 'Inscription validée'});
  }

  async unsubscribeToEvent(event: EventModel, e: Event) {
    this.confirmationService.confirm({
      target: e.target,
      message: 'Voulez-vous vraiment vous désinscrire de l\'événement ?',
      icon: 'pi pi-users',
      accept: async () => {
        this.eventParticipants = await this.eventService.unregisterToEvent(event.eventId);
        this.events = await this.eventService.getAvailableEvents();
        this.currentUserParticipateToEvents = await this.setCurrentUserParticipateToEvents(this.events);
        this.visibleEvent = this.events.find(event => event.eventId === event.eventId);
        this.messageService.add({severity: 'info', summary: 'Désinscrit', detail: 'Désinscription effectuée'});
      }
    });
  }

  async participateToCarpool(carpool: CarpoolModel) {
    this.carpoolParticipants = await this.carpoolService.registerToCarpool(carpool.carpoolId);
    this.eventCarpools = await this.getCarpoolsOfEvent(this.visibleEvent);
    this.visibleCarpool = this.eventCarpools.find(event => event.carpoolId === carpool.carpoolId);
    this.currentUserParticipateToCarpools = await this.setCurrentUserParticipateToCarpools(this.eventCarpools);
  }

  async unsubscribeToCarpool(carpool: CarpoolModel, e: Event) {
    this.confirmationService.confirm({
      target: e.target,
      message: 'Voulez-vous vraiment vous désinscrire du covoiturage ?',
      icon: 'pi pi-users',
      accept: async () => {
        this.carpoolParticipants = await this.carpoolService.unregisterToCarpool(carpool.carpoolId);
        this.eventCarpools = await this.getCarpoolsOfEvent(this.visibleEvent);
        this.currentUserParticipateToCarpools = await this.setCurrentUserParticipateToCarpools(this.eventCarpools);
        this.visibleCarpool = this.eventCarpools.find(event => event.carpoolId === carpool.carpoolId);
        this.currentUserParticipateToCarpool = false;
        this.messageService.add({severity: 'info', summary: 'Désinscrit', detail: 'Désinscription effectuée'});
      }
    });
  }

  //TODO vérifier que c'est faisable avec des fonctions de js
  async setCurrentUserParticipateToEvents(events: EventModel[]): Promise<Map<number, boolean>> {
    const currentUserParticipateToEvent = new Map();
    for (let i = 0; i < events.length; i += 1) {
      const participants = await this.getParticipantsOfEvent(events[i]);
      let j;
      for (j = 0; j < participants.length; j += 1) {
        if (participants[j].mail === this.currentUser.mail) {
          break;
        }
      }
      if (j < participants.length) {
        currentUserParticipateToEvent.set(events[i].eventId, true);
      } else {
        currentUserParticipateToEvent.set(events[i].eventId, false);
      }
    }
    return currentUserParticipateToEvent;
  }

  //TODO vérifier que c'est faisable avec des fonctions de js
  async setCurrentUserParticipateToCarpools(carpools: CarpoolModel[]): Promise<Map<number, boolean>> {
    const currentUserParticipateToCarpools = new Map();
    for (let i = 0; i < carpools.length; i += 1) {
      if(carpools[i].conductorId === this.currentUser.mail) {
        this.currentUserParticipateToCarpool = true;
        continue;
      }
      const participants = await this.getParticipantsOfCarpool(carpools[i]);
      let j;
      for (j = 0; j < participants.length; j += 1) {
        if (participants[j].mail === this.currentUser.mail) {
          break;
        }
      }
      if (j < participants.length) {
        currentUserParticipateToCarpools.set(carpools[i].carpoolId, true);
        this.currentUserParticipateToCarpool = true;
      } else {
        currentUserParticipateToCarpools.set(carpools[i].carpoolId, false);
      }
    }
    return currentUserParticipateToCarpools;
  }
}

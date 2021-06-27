import {AfterViewInit, Component, OnInit} from '@angular/core';
import {UserModel} from '../../models/user.model';
import {ZoneModel} from '../../models/zone.model';
import {MediaModel} from '../../models/media.model';
import {Router} from '@angular/router';
import {AuthenticatedUserService} from '../../services/authenticated-user.service';
import {ZoneService} from '../../services/zone.service';

@Component({
  selector: 'app-my-zones',
  templateUrl: './my-zones.component.html',
  styleUrls: ['./my-zones.component.css']
})
export class MyZonesComponent implements OnInit, AfterViewInit {

  token: string;
  currentUser: UserModel;

  zones: ZoneModel[] = [];
  validatedZones: ZoneModel[] = [];
  waitingZones: ZoneModel[] = [];
  refusedZones: ZoneModel[] = [];

  isZoneDetailVisible = false;
  visibleZone: ZoneModel;

  zonePictures: MediaModel[];

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

  selectedZone: ZoneModel;

  isLoadedData: boolean;

  constructor(private router: Router,
              private authenticatedUserService: AuthenticatedUserService,
              private zoneService : ZoneService) {}

  async ngOnInit() {
    this.initToken();
    await this.initCurrentUser();
    if (this.currentUser === null || this.currentUser === undefined) {
      this.authenticatedUserService.loadCurrentUser().then(async () => {
        await this.initCurrentUser();
        window.location.reload();
      });
    }
    this.waitingZones = await this.zoneService.getWaitingZonesByUser();
    this.refusedZones = await this.zoneService.getRefusedZonesByUser();
    this.validatedZones = await this.zoneService.getValidatedZonesByUser();
    this.isLoadedData = true;
  }

  async ngAfterViewInit() {
    if (!this.authenticatedUserService.isAuthenticated()) {
      this.authenticatedUserService.redirectToAuthentication();
    }
  }

  initToken() {
    this.token = this.authenticatedUserService.getToken();
  }

  async initCurrentUser() {
    this.currentUser = await this.authenticatedUserService.getCurrentUser();
  }

  async onZoneDetailClicked(zone: ZoneModel): Promise<void> {
    this.isZoneDetailVisible = true;
    this.visibleZone = zone;
    this.zonePictures = [];
    this.zonePictures = await this.getPicturesOfZone(zone);
  }

  getPicturesOfZone(zone: ZoneModel): Promise<MediaModel[]> {
    return this.zoneService.getPicturesZone(zone.zoneId)
      .then(function (pictures) {
        return pictures;
      });
  }
}

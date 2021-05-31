import {AfterViewInit, Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticatedUserService} from "../../services/authenticated-user.service";
import {EventModel} from "../../models/event.model";
import {EventService} from "../../services/event.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  @Input() token: string;

  events: EventModel[] = [];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authenticatedUserService: AuthenticatedUserService,
              private eventService: EventService) {
  }

  async ngAfterViewInit() {
    if (!this.authenticatedUserService.isAuthenticated()) {
      this.authenticatedUserService.redirectToAuthentication();
    }

    this.events = await this.eventService.getAvailableEvents();
  }

}

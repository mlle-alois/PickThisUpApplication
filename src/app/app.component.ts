import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AuthenticatedUserService} from "./services/authenticated-user.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit {

  token: string;

  constructor(private router: Router, private route: ActivatedRoute, private authenticatedUserService: AuthenticatedUserService) {
  }

  ngOnInit() {
    this.initToken();
  }

  ngAfterViewInit() {
    if(!this.authenticatedUserService.isAuthenticated()) {
      this.authenticatedUserService.redirectToAuthentication();
    }
  }

  initToken() {
    if(!this.authenticatedUserService.getToken()) {
      this.route.queryParams.subscribe(params => {
        this.token = params['token'];
        this.authenticatedUserService.setToken(this.token);
      });
    }
    else {
      this.token = this.authenticatedUserService.getToken();
    }
  }
}

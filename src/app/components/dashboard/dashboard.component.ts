import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentToken: any;

  constructor(private router: Router, private route: ActivatedRoute) {
    if(!localStorage.getItem('currentToken')) {
      this.route.queryParams.subscribe(params => {
        this.currentToken = params['token'];
        localStorage.setItem('currentToken', this.currentToken);
      });
    }
    else {
      this.currentToken = localStorage.getItem('currentToken');
    }
  }

  /*userDetails() {
    if (localStorage.getItem('currentToken')) {
      this.token = localStorage.getItem('currentToken');
      this.email = JSON.parse(this.currentUser).objects[0].metafields[1].value;
      this.gender = JSON.parse(this.currentUser).objects[0].metafields[3].value;
      this.mobile = JSON.parse(this.currentUser).objects[0].metafields[4].value;
      this.image = "./../../../assets/pickThisUpLogo.PNG"
    } else if (localStorage.getItem('googleUser')) {
      console.log(JSON.parse(localStorage.getItem('googleUser')))
      this.name = JSON.parse(localStorage.getItem('googleUser')).objects[0].metafields[0].value;
      this.email = JSON.parse(localStorage.getItem('googleUser')).objects[0].metafields[1].value;
      this.gender = JSON.parse(localStorage.getItem('googleUser')).objects[0].metafields[3].value;
      this.mobile = JSON.parse(localStorage.getItem('googleUser')).objects[0].metafields[4].value;
      this.image = JSON.parse(localStorage.getItem('googleUser')).objects[0].metafields[5].value;
    }
  }*/

  logout() {
    if (this.currentToken) {
      localStorage.removeItem('currentToken');
    }
    window.location.href = 'http://localhost:4200/logout';
  }


  ngOnInit() {
    if (!localStorage.getItem('currentToken') || localStorage.getItem('currentToken') === undefined) {
      window.location.href = 'http://localhost:4200/logout';
    }
    //this.userDetails();
  }

}

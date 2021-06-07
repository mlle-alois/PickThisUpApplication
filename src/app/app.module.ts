import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {HttpClient} from "@angular/common/http";
import {ReactiveFormsModule} from '@angular/forms';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {HomeComponent} from './components/home/home.component';
import {NgxLoadingModule} from 'ngx-loading';
import {NgModule} from "@angular/core";
import {ButtonModule} from "primeng/button";
import { MenuComponent } from './components/menu/menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {MenubarModule} from "primeng/menubar";
import {CardModule} from "primeng/card";
import {DialogModule} from 'primeng/dialog';
import {TableModule} from "primeng/table";
import { ActionButtonsComponent } from './components/action-buttons/action-buttons.component';
import { MySpaceComponent } from './components/my-space/my-space.component';
import { MyEventsComponent } from './components/my-events/my-events.component';
import { MyZonesComponent } from './components/my-zones/my-zones.component';
import { ZonesComponent } from './components/zones/zones.component';
import {GalleriaModule} from "primeng/galleria";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    MenuComponent,
    ActionButtonsComponent,
    MySpaceComponent,
    MyEventsComponent,
    MyZonesComponent,
    ZonesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxLoadingModule.forRoot({}),
    ButtonModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatIconModule,
    MenubarModule,
    CardModule,
    DialogModule,
    TableModule,
    GalleriaModule
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule {
}

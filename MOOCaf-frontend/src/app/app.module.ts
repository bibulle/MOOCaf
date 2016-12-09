///<reference path="../../node_modules/@angular/material/core/core.d.ts"/>
import { BrowserModule } from "@angular/platform-browser";
import { NgModule, enableProdMode } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";


import { LOG_LOGGER_PROVIDERS, INFO_LOGGER_PROVIDERS } from "angular2-logger/core";
import { AUTH_PROVIDERS } from "angular2-jwt";

import { AppComponent } from "./app.component";

import { CourseModule } from "./course/course.module";
import { UserModule } from "./user/user.module";
import { HomeModule } from "./home/home.module";
import { LoginModule } from "./login/login.module";

// import { FlexModule } from "./widget/flex/flex.module";
import { ScrollDetectorModule } from "./widget/scroll-detector/scroll-detector.module";
import { NotificationModule } from "./widget/notification/notification.module";
import { AboutButtonModule } from "./about-button/about-button.module";

import { AppRoutingModule } from "./app-routing.module";
import { SignupModule } from "./signup/signup.module";
import { AwardsModule } from "./awards/awards.module";
import { CatalogueModule } from "./catalogue/catalogue.module";
import { AuthGuard } from "./shared/auth-guard";
import { ProgressionModule } from "./progression/progression.module";
import { NotFoundModule } from "./not-found/not-found.module";
import { environment } from "../environments/environment";
import {
  MdCoreModule, MdButtonModule, MdIconModule, MdCardModule, MdInputModule, MdRadioModule, MdCheckboxModule,
  MdToolbarModule, MdSidenavModule
} from "@angular/material";

let loggerProvider = LOG_LOGGER_PROVIDERS;
if (environment.production) {
  enableProdMode();
  loggerProvider = INFO_LOGGER_PROVIDERS;
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,

    MdCoreModule,
    MdButtonModule,
    MdIconModule.forRoot(),
    MdCardModule,
    MdInputModule,
    MdRadioModule,
    MdCheckboxModule,
    MdToolbarModule,
//    MdTooltipModule,
    MdSidenavModule,

    // FlexModule,
    ScrollDetectorModule,
    NotificationModule,
    AboutButtonModule,
    AppRoutingModule,
    HomeModule,
    LoginModule,
    SignupModule,
    CourseModule,
    UserModule,
    AwardsModule,
    CatalogueModule,
    ProgressionModule,
    NotFoundModule,
  ],
  providers: [
    loggerProvider,
    AUTH_PROVIDERS,
    AuthGuard
  ],
  schemas: [
    // CUSTOM_ELEMENTS_SCHEMA
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

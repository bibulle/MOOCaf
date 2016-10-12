import {NgModule, enableProdMode, CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {SimpleNotificationsModule} from "angular2-notifications";
import {LOG_LOGGER_PROVIDERS, INFO_LOGGER_PROVIDERS} from "angular2-logger/core";
import {AUTH_PROVIDERS} from "angular2-jwt";

import {MdCoreModule} from "@angular2-material/core";
//import {OVERLAY_PROVIDERS} from "@angular2-material/core/overlay/overlay";
import {MdButtonModule} from "@angular2-material/button";
import {MdIconModule} from "@angular2-material/icon";
import {MdCardModule} from "@angular2-material/card";
import {MdInputModule} from "@angular2-material/input";
import {MdRadioModule} from "@angular2-material/radio";
import {MdCheckboxModule} from "@angular2-material/checkbox";
import {MdToolbarModule} from "@angular2-material/toolbar";
import {MdSidenavModule} from "@angular2-material/sidenav";
//import {MdTooltipModule} from "@angular2-material/tooltip";
import { MdUniqueSelectionDispatcher } from '@angular2-material/core';


import {LayoutAlignDirective} from "./directives/layout-align-directive";
import {LayoutDirective} from "./directives/layout-directive";
import {FlexDirective} from "./directives/flex-directive";
import {UserService} from "./services/user.service";
import {CourseService} from "./services/course.service";
import {NotificationService} from "./services/notification.service";
import {AuthGuard} from "./common/auth.guard";

import {AppComponent} from "./components/app/app.component";
import {environment} from "./environment";
import {appRoutingProviders, routing} from "./app.routes";

import {AboutComponent} from "./components/about/about.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {HomeComponent} from "./components/home/home";
import {LoginComponent} from "./components/login/login";
import {SignupComponent} from "./components/signup/signup";
import {NotFoundComponent} from "./components/404/404";
import {LogoComponent} from "./components/logo/logo";
import {CatalogueComponent} from "./components/catalogue/catalogue";
import {CourseCardComponent} from "./components/course-card/course-card";
import {ClassComponent} from "./components/class/class";
import {ClassScheduleComponent} from "./components/class-schedule/class-schedule";
import {ParagraphComponent} from "./components/paragraph/paragraph";
import {ParagraphMarkdownComponent} from "./components/paragraph-markdown/paragraph-markdown";
import {ParagraphFormComponent} from "./components/paragraph-form/paragraph-form";
import {ProgressionComponent} from "./components/progression/progression";
import {ScrollDirective} from "./directives/scroll-directive";
import {ScrollService} from "./services/scroll.service";
import {VisibleDirective} from "./directives/visible-directive";
import {CourseProgressionCardComponent} from "./components/course-progresssion-card/course-progression-card";
import {AwardsComponent} from "./components/awards/awards";

let loggerProvider = LOG_LOGGER_PROVIDERS;
if (environment.production) {
  enableProdMode();
  loggerProvider = INFO_LOGGER_PROVIDERS;
}

@NgModule({
  imports: [
    BrowserModule,
    SimpleNotificationsModule,
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
    routing,
//    OVERLAY_PROVIDERS
  ],
  declarations: [
    AppComponent,
    ProfileComponent,
    AboutComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    NotFoundComponent,
    LogoComponent,
    CatalogueComponent,
    CourseCardComponent,
    CourseProgressionCardComponent,
    ClassComponent,
    ClassScheduleComponent,
    ParagraphComponent,
    ParagraphMarkdownComponent,
    ParagraphFormComponent,
    ProgressionComponent,
    AwardsComponent,
    FlexDirective,
    LayoutDirective,
    LayoutAlignDirective,
    ScrollDirective,
    VisibleDirective
  ],
  bootstrap: [AppComponent],
  providers: [
    loggerProvider,
    UserService,
    CourseService,
    NotificationService,
    ScrollService,
    AuthGuard,
    AUTH_PROVIDERS,
    appRoutingProviders,
    MdUniqueSelectionDispatcher
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {
}



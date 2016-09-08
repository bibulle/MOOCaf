import {NgModule, enableProdMode, CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {SimpleNotificationsModule, SimpleNotificationsComponent} from "angular2-notifications";
import {LOG_LOGGER_PROVIDERS, INFO_LOGGER_PROVIDERS} from "angular2-logger/core";
import {AUTH_PROVIDERS} from "angular2-jwt";

import {MdCoreModule} from "@angular2-material/core";
import {MdButtonModule} from "@angular2-material/button";
import {MdIconModule} from "@angular2-material/icon";
import {MdCardModule} from "@angular2-material/card";
import {MdInputModule} from "@angular2-material/input";
import {MdToolbarModule} from "@angular2-material/toolbar";


import {LayoutAlignDirective} from "./directives/layout-align-directive";
import {LayoutDirective} from "./directives/layout-directive";
import {FlexDirective} from "./directives/flex-directive";
import {UserService} from "./services/user.service";
//import {AuthGuard} from "./common/auth.guard";

import {AppComponent} from "./components/app/app.component";
import {environment} from "./environment";
import {APP_ROUTES_PROVIDER} from "./app.routes";

import {AboutComponent} from "./components/about/about.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {HomeComponent} from "./components/home/home";
import {LoginComponent} from "./components/login/login";
import {NotFoundComponent} from "./components/404/404";
import {LogoComponent} from "./components/logo/logo";
//import {ParagraphComponent} from "./paragraph/paragraph.home";
//import {ParagraphMarkdownComponent} from "./paragraph-markdown/paragraph-markdown.home";
//import {ParagraphFormComponent} from "./paragraph-form/paragraph-form.home";

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
    MdToolbarModule,
    APP_ROUTES_PROVIDER
  ],
  declarations: [
    AppComponent,
    ProfileComponent,
    AboutComponent,
    HomeComponent,
    LoginComponent,
    NotFoundComponent,
    LogoComponent,
    // ParagraphComponent,
    // ParagraphMarkdownComponent,
    // ParagraphFormComponent,
    // SimpleNotificationsComponent,
    FlexDirective,
    LayoutDirective,
    LayoutAlignDirective
  ],
  bootstrap: [AppComponent],
  providers: [
    loggerProvider,
    UserService,
    // AuthGuard,
    AUTH_PROVIDERS
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {
}



import {NgModule, enableProdMode} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {AppComponent} from "./app.component";
import {SimpleNotificationsModule, SimpleNotificationsComponent} from "angular2-notifications";
import {HttpModule} from "@angular/http";
import {LOG_LOGGER_PROVIDERS, INFO_LOGGER_PROVIDERS} from "angular2-logger/core";
import {environment} from "./environment";
import {FormsModule} from "@angular/forms";
import {APP_ROUTES_PROVIDER} from "./app.routes";
import {UserService} from "./services/user.service";
import {AuthGuard} from "./common/auth.guard";
import {AUTH_PROVIDERS} from "angular2-jwt";
import {MdButtonModule} from "@angular2-material/button";
import {LayoutAlignDirective} from "./directives/layout-align-directive";
import {LayoutDirective} from "./directives/layout-directive";
import {FlexDirective} from "./directives/flex-directive";
import {ParagraphComponent} from "./paragraph/paragraph.component";
import {AboutComponent} from "./about.component/about.component";
import {ProfileComponent} from "./profile.component/profile.component";
import {ParagraphMarkdownComponent} from "./paragraph-markdown/paragraph-markdown.component";
import {ParagraphFormComponent} from "./paragraph-form/paragraph-form.component";

let loggerProvider = LOG_LOGGER_PROVIDERS;
if (environment.production) {
  enableProdMode();
  loggerProvider = INFO_LOGGER_PROVIDERS;
}

@NgModule({
  imports: [BrowserModule, SimpleNotificationsModule, FormsModule, HttpModule, MdButtonModule, APP_ROUTES_PROVIDER],
  declarations: [
    AppComponent,
    ProfileComponent,
    AboutComponent,
    ParagraphComponent,
    ParagraphMarkdownComponent,
    ParagraphFormComponent,
    SimpleNotificationsComponent,
    FlexDirective,
    LayoutDirective,
    LayoutAlignDirective],
  bootstrap: [AppComponent],
  providers: [loggerProvider, UserService, AuthGuard, AUTH_PROVIDERS]
})
export class AppModule {
}


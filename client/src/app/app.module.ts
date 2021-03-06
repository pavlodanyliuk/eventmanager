import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';
import { HttpClientModule, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS, HttpHeaders } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2CloudinaryModule } from 'ng2-cloudinary';
import { FileUploadModule } from 'ng2-file-upload';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AgmCoreModule } from '@agm/core';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { CalendarModule } from 'angular-calendar';

import { environment }           from '../environments/environment';
import { AppRoutingModule }      from './modules/app-routing.module';
import { AuthService }           from './services/auth.service';
import { UserService }           from './services/user.service';
import { LoggerService }         from './services/logger.service';
import { ToastService }         from './services/toast.service';
import { AppComponent }          from './app.component';
import { LoginComponent }        from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { HelloComponent }        from './components/hello/hello.component';
import { HomeComponent }         from './components/home/home.component';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';
import { CreateEventComponent }   from './components/createEvent/createEvent.component';
import { ViewEventComponent }   from './components/viewEvent/viewEvent.component';
import { EventEditComponent } from './components/event-edit/event-edit.component';
import { EventService } from "./services/event.service";
import { UserComponent } from './components/user/user.component';
import { UserListComponent } from './components/user/user-list.component';
import { UserEditComponent } from './components/user/user-edit.component';
import { EventsListComponent } from './components/events-list/events-list.component';
import { PublicEventListComponent } from './components/public-event-list/event-list.component';
import { DraftsEventListComponent } from './components/drafts-event-list/drafts-event-list.component';
import { CreatedEventListComponent } from './components/created-event-list/created-event-list.component';
import { UserEventListComponent } from './components/user-event-list/user-event-list.component';
import { UserEditImageComponent } from './components/user/user-edit-image.component';
import { UserSearchComponent } from './components/user/user-search.component';
import { ImageUploaderService } from "./services/image-uploader.service";
import { WishListComponent } from './components/wishlist/wishlist.component';
import { WishListService } from './services/wishlist.service';
import { CreateItemComponent } from './components/wishlist/item/create-item/create-item.component';
import { ItemService } from './services/item.service';
import { ViewItemComponent } from './components/wishlist/item/view-item/view-item.component';
import { ChatComponent } from './components/chat/chat.component';
import { ExportEventsPlanComponent } from './components/export-events-plan/export-events-plan.component';
import { UserEditPasswordComponent } from './components/user/user-edit-password/user-edit-password.component';
import { PersonalPlanSettingComponent } from './components/personal-plan-setting/personal-plan-setting.component';
import { PersonalPanSettingService } from "./services/personal-pan-setting.service";
import { RecoverPasswordComponent } from './components/recover-password/recover-password.component';
import { RecoverLoginComponent } from './components/recover-login/recover-login.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { PartialUserListComponent } from './components/user/partial/partial-user-list/partial-user-list.component';
import { PartialUserImageComponent } from './components/user/partial/partial-user-image/partial-user-image.component';
import { PartialUserFriendshipButtonComponent } from './components/user/partial/partial-user-friendship-button/partial-user-friendship-button.component';
import { LikeService } from "./services/like.service";
import { EditItemComponent } from './components/wishlist/item/edit-item/edit-item.component';
import { FolderService } from "./services/folder.service";
import { RootFolderComponent } from './components/folders/rootFolder/rootFolder.component';
import { FolderComponent } from './components/folders/folder/folder.component';
import { CreateNoteComponent } from './components/note/createNote/createNote.component';
import { ViewNoteComponent } from './components/note/viewNote/viewNote.component';
import { NoteService } from "./services/note.service";
import {ChecklistModule} from "angular-checklist";
import { NgSelectModule } from '@ng-select/ng-select';
import { UserSettingsComponent } from './components/user/user-settings/user-settings.component';
import { UserCalendarComponent } from './components/user-calendar/user-calendar.component';
import {NgxEditorModule} from "ngx-editor";
import { NoHtmlPipe } from "./pipes/nohtml.pipe";
import { UserEditEmailComponent } from './components/user/user-edit-email/user-edit-email.component';
import { AddItemImagesComponent } from './components/wishlist/item/add-item-images/add-item-images.component';
import { MessageService } from "./services/message.service";
import { NotificationSettingsComponent } from './components/notification-settings/notification-settings.component';
import {NotificationSettingsService} from "./services/notification-settings.service";
import { StatisticsService } from './services/statistics.service';
import {StatisticsComponent} from "./components/statistics/statistics.component";
import {NoteEditComponent} from "./components/note/note-edit/note-edit.component";
import { ConvertComponent } from './components/note/convert/convert.component';
import { WishPanelComponent } from './components/wishlist/wish-panel/wish-panel.component';
import {TextMaskModule} from "angular2-text-mask";

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    req = req.clone({
        setHeaders: {
          Authorization: sessionStorage.getItem('authToken')
        }
    });
    return next.handle(req);
  }
}

@Injectable()
export class AddressInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    req = req.clone({
      url: environment.base_url + req.url
    });
    return next.handle(req);
  }
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    HelloComponent,
    HomeComponent,
    EmailVerificationComponent,
    CreateEventComponent,
    ViewEventComponent,
    EventEditComponent,
    EventsListComponent,
    PublicEventListComponent,
    DraftsEventListComponent,
    CreatedEventListComponent,
    UserEventListComponent,
    UserComponent,
    UserListComponent,
    UserEditComponent,
    UserEditImageComponent,
    UserEditPasswordComponent,
    UserSearchComponent,
    WishListComponent,
    CreateItemComponent,
    ViewItemComponent,
    ChatComponent,
    ExportEventsPlanComponent,
    RootFolderComponent,
    FolderComponent,
    CreateNoteComponent,
    PersonalPlanSettingComponent,
    RecoverLoginComponent,
    RecoverPasswordComponent,
    ChangePasswordComponent,
    ExportEventsPlanComponent,
    PartialUserListComponent,
    PartialUserImageComponent,
    PartialUserFriendshipButtonComponent,
    EditItemComponent,
    UserSettingsComponent,
    UserCalendarComponent,
    NoHtmlPipe,
    UserEditEmailComponent,
    AddItemImagesComponent,
    NotificationSettingsComponent,
    ViewNoteComponent,
    StatisticsComponent,
    NoteEditComponent,
    ConvertComponent,
    WishPanelComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2CloudinaryModule,
    FileUploadModule,
    CommonModule,
    BrowserAnimationsModule,
    ChecklistModule,
    NgSelectModule,
    CalendarModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 5000
    }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAM7RXrVYjGXrOIM1NrlifgXf8pdmzVZf0',
      libraries: ["places"]
    }),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxEditorModule,
    TextMaskModule
  ],
  providers: [
    AuthService,
    EventService,
    UserService,
    LoggerService,
    ToastService,
    FolderService,
    NoteService,
    ImageUploaderService,
    WishListService,
    ItemService,
    PersonalPanSettingService,
    MessageService,
    LikeService,
    NotificationSettingsService,
    StatisticsService,
    { provide: HTTP_INTERCEPTORS,
      useClass: AddressInterceptor,
      multi: true},
    { provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

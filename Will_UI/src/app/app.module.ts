import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NavBarComponent } from './core/nav-bar/nav-bar.component';
import { AppComponent } from './app.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { AccountRoutingModule } from './account/account-routing.module';
import { ButtonModule } from 'primeng/button';
import { WillDetailsComponent } from './core/will-details/will-details.component';
import { CardModule } from 'primeng/card';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { TextInputComponent } from './core/text-input/text-input.component';
import { ToastrModule } from 'ngx-toastr';
import { CalendarModule } from 'primeng/calendar';
import { DatePipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { WillViewComponent } from './core/will-view/will-view.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    WillDetailsComponent,
    TextInputComponent,
    WillViewComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AccountRoutingModule,
    ButtonModule,
    InputTextareaModule,
    CardModule,
    FormsModule,
    AngularEditorModule,
    CalendarModule,
    DialogModule,
    ToastrModule.forRoot(),

  ],
  providers: [
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { AlertComponent } from './alert/alert.component';
import { SafehtmlPipe } from '../pipes/safehtml.pipe';
import { ScrollSpyElementDirective } from '../directives/scroll-spy-element.directive';
import { SendmailComponent } from '../components/main/sendmail/sendmail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    SendmailComponent,
    LoadingSpinnerComponent,
    AlertComponent,
    SafehtmlPipe,
    ScrollSpyElementDirective,
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    SendmailComponent,
    LoadingSpinnerComponent,
    AlertComponent,
    SafehtmlPipe,
    ScrollSpyElementDirective,
  ]
})
export class SharedModule { }

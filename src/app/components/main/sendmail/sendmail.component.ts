import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Details } from '../../../models/details.model';
import { SpringMailService } from '../../../services/spring-mail.service';

@Component({
  selector: 'app-sendmail',
  templateUrl: './sendmail.component.html',
  styleUrls: ['./sendmail.component.css']
})
export class SendmailComponent implements OnInit {


  @ViewChild('contactForm',  { static: false }) signupForm: NgForm;
  formSubError = false;
  error: string = null;
  strongError: string = null;
  lawfirmMail = "someone@yoursite.com"
  isLoading: boolean = false;
  private dataset : Details;

  public activeTab: string = 'form';


  constructor(private springMailService: SpringMailService) { }

  ngOnInit(): void {
  }

  onSubmit()
  {
    this.isLoading = true;
    this.formSubError = false;
    if (this.signupForm.valid ) {
      this.dataset = new Details(this.signupForm.value.fullName,
                                this.signupForm.value.phoneNumber,
                                this.signupForm.value.email,
                                this.signupForm.value.caseDescription)

    this.springMailService.sendMail(this.dataset)
      .subscribe(
        res => {
          this.isLoading = false;
          alert('Dear Madam / Sir ' +  res.fullName + ',' +
              '\nThe message has been sent, the law firm will try to reply in the near future.' +
              '\n\Best regards' );
          this.signupForm.reset()
          this.dataset.fullName = '';
          this.dataset.phoneNumber = null;
          this.dataset.email = '';
          this.dataset.caseDescription = '';
        },
        error=> {
          console.log(error);
          if (error.status >= 500) {
            this.error = "Internal mail server error, please send an email directly to the address:"
            this.strongError = this.lawfirmMail
          } else if (error.status >= 400 && error.status < 500 ) {
            this.error = "No connection to the mail server, please send a direct mail to the address:"
            this.strongError = this.lawfirmMail
          } else {
            this.error = "No connection to the e-mail service, please send a direct e-mail to the address:"
            this.strongError = this.lawfirmMail
          }
          this.isLoading = false;
        })
    } else {
      this.formSubError = true;
      this.isLoading = false;
    }
  }

  onHandleError() {
    this.error = null;
    this.strongError = null;
  }

}

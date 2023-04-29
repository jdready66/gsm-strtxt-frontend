import { HttpErrorResponse } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-notify-customer',
  templateUrl: './notify-customer.component.html',
  styleUrls: ['./notify-customer.component.css'],
})
export class NotifyCustomerComponent implements OnInit, AfterViewInit {
  user: User = new User();
  errorMessage: String = '';

  pinForm: FormGroup;
  ticketForm: FormGroup;

  constructor(private userService: UserService, private renderer: Renderer2) {
    this.pinForm = new FormGroup({
      pin: new FormControl(''),
    });

    this.ticketForm = new FormGroup({
      ticket: new FormControl('')
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.setFieldFocus('pin');
  }

  setFieldFocus(fieldName: string) {
      setTimeout(() => {
        console.log('setting focus to ' + fieldName);
        this.renderer.selectRootElement('#'+fieldName).focus();
      }, 500);
  }

  onSubmitPinForm() {
    this.errorMessage = '';

    var pinValue = this.pinForm.get('pin')?.value;
    if (!pinValue) return;
    this.pinForm.get('pin')?.setValue('');

    console.log('onSubmitPinForm()');
    console.log('pin: ' + pinValue);
    this.userService.getUserByPin(pinValue).subscribe({
      next: (data) => {
        console.log('getUserByPin().next() data:', data);
        this.user = data;
        this.setFieldFocus('ticket');
      },
      error: (error: HttpErrorResponse) => {
        console.log('getUserByPin().error() error:');
        console.log(error);
        switch (error.status) {
          case 404:
            this.errorMessage = 'No User Found With That PIN.';

            break;

          default:
            this.errorMessage = 'Unknown Error Response';
            break;
        }
      },
    });
  }

  logout() {
    this.user = new User();
    this.setFieldFocus('pin');
  }

  onSubmitTicketForm() {
    var ticketValue = this.ticketForm.get('ticket')?.value;
    console.log('onTickerFormSubmit(), ticket: ' + ticketValue);
  }
}

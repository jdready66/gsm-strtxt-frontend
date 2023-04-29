import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/models/user.model';
import { AdminService } from 'src/app/services/admin.service';
import { UserService } from 'src/app/services/user.service';
import CustomValidators from 'src/app/validation/CustomValidators';

@Component({
  selector: 'app-password-modal',
  templateUrl: './password-modal.component.html',
  styleUrls: ['./password-modal.component.css'],
})
export class PasswordModalComponent implements OnInit {
  @Input() public user: User;
  currentPasswordRequired: boolean = false;
  passwordForm: FormGroup;
  errorMessage: string = "";

  constructor(
    public activeModal: NgbActiveModal,
    private adminService: AdminService,
    private renderer: Renderer2
  ) {
    this.user = new User();
    this.passwordForm = new FormGroup({});
  }

  requireCurrentPassword(): void {
    console.log('setting currentPasswordRequired');
    this.currentPasswordRequired = true;
    this.passwordForm.addControl(
      'currentPassword',
      new FormControl('', [Validators.required])
    );
    console.log('added');
  }

  ngOnInit(): void {
    console.log('creating passwordForm');
    this.passwordForm.addControl(
      'password',
      new FormControl('', [Validators.required])
    );
    this.passwordForm.addControl(
      'confirm',
      new FormControl('', [Validators.required])
    );
    this.passwordForm.addValidators([
      CustomValidators.match('password', 'confirm'),
    ]);
    // this.passwordForm = new FormGroup(
    //   {
    //     password: new FormControl('', [Validators.required]),
    //     confirm: new FormControl('', [Validators.required]),
    //   },
    //   [CustomValidators.match('password', 'confirm')]
    // );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.passwordForm.controls;
  }

  focusPassword() {
    setTimeout(() =>
      this.renderer
        .selectRootElement(
          this.currentPasswordRequired ? '#currentPassword' : '#password'
        )
        .focus()
    );
  }

  fixForm() {
    this.passwordForm.reset();
    console.log('clearing validators...');
    Object.keys(this.passwordForm.controls).forEach((key) => {
      console.log('clearing validators for: ' + key);
      const fld = this.passwordForm.controls[key];
      fld.clearValidators();
      fld.updateValueAndValidity();
    });
    this.passwordForm.clearValidators();
    this.passwordForm.updateValueAndValidity();
  }

  closeModal() {
    console.log('in closeModal()');
    this.activeModal.close('Password Change Cancelled: ' + this.user.name);
  }

  changePassword() {
    console.log('in changePassword()');
    this.user = Object.assign(this.user, this.passwordForm.value);
    console.log(this.user);
    console.log(this.passwordForm.controls['currentPassword']?.value);
      this.adminService
        .updatePassword(
          this.user,
          this.passwordForm.controls['currentPassword']?.value
        )
        .subscribe({
          next: (data) => {
            this.passwordForm.reset();
            this.activeModal.close('Password Updated: ' + data.name);
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
            switch(err.status) {
              case 412: // PRECONDITION_FAILED
                this.errorMessage = "id on URL must match id of user in body";
                break;

              case 422: // UNPROCESSABLE_ENTITY
                this.errorMessage = "You must pass a currentPassword (NOT Admin)"
                break;
              
              case 404: // NOT_FOUND
                this.errorMessage = "The user id was not found";
                break;

              case 409:
                this.errorMessage = "The current password does not match.";
                break;
              
              
              default:
                this.errorMessage = "Unexpected Error";
                break;
            }
          },
        });
  }
}

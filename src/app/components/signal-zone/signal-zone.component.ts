
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Component, Input, OnInit, Output} from "@angular/core";
import {EventEmitter} from "@angular/core";

@Component({
  selector: 'app-signal-zone',
  templateUrl: './signal-zone.component.html',
  styleUrls: ['./signal-zone.component.css']
})
export class SignalZoneComponent implements OnInit {

  isSignalZoneClickedValue: boolean;
  get isSignalZoneClicked(): boolean {
    return this.isSignalZoneClickedValue;
  }
  @Input() set isSignalZoneClicked(value: boolean) {
    this.isSignalZoneClickedValue = value;
    this.isSignalZoneClickedChange.emit(this.isSignalZoneClickedValue);
  }

  @Output() isSignalZoneClickedChange = new EventEmitter<boolean>();

  registerForm: FormGroup; //declare the reactive forms group for register
  passwordMatched: boolean = false;
  returnedData: any;
  message: any;
  loading = "";

  constructor(
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      'fullName': ['', Validators.required],
      'firstName': ['', Validators.required],
      'password': ['', [Validators.pattern('^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()])[a-zA-Z0-9!@#$%^&*()]{8,}$'), Validators.required]],
      'confirmPassword': ['', Validators.required],
      'email': ['', [Validators.email, Validators.required]],
      'mobile': ['', [Validators.minLength(10), Validators.required, Validators.pattern('0[0-9]{9}')]]

    });
  }

  ngOnInit(): void {
  }

  register() {
    this.message = "";
    this.loading = "loading...";
    const data = this.registerForm.value;
  }

  checkPasswordMatch(password) {
    //this.passwordMatched = password == this.userModel.confirmPassword;
  }

  checkConfirmPasswordMatch(confirmedPassword) {
    //this.passwordMatched = confirmedPassword == this.userModel.password;
  }

  loginCall() {
    //this.router.navigate([''])
  }

}

import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormGroup, FormControl, Validators } from '@angular/forms'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private auth: AngularFireAuth) { }

  email = new FormControl('',[
    Validators.required,
    Validators.email
  ]);

  password = new FormControl('', [
    Validators.required,
  ]);

  inSubmission = false;
  showAlert = false;
  alertMsg = 'wow';
  alertColor= 'blue';

  loginForm = new FormGroup({
    email: this.email,
    password: this.password
  });

  async login() {
    this.showAlert = true;
    this.alertMsg = 'Please wait! We are logging you in.';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      // await this.auth.createUser(this.registerForm.value); 
      await this.auth.signInWithEmailAndPassword(
        this.email.value,
        this.password.value
      ) 
    } catch (error) {
      console.error(error);
      this.alertMsg = 'An unexpected error occured!';
      this.alertColor = 'red';
      this.inSubmission = false;
      return;
    }

    this.alertMsg = 'Success! Your are logged in';
    this.alertColor = 'green';
  }

}

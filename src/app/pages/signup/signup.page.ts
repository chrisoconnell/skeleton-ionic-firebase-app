import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/user/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  signupForm: FormGroup;
  loading: HTMLIonLoadingElement;

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    });
  }

  isEmailFieldInvalid(): boolean {
    return !this.signupForm.controls['email'].valid && this.signupForm.controls['email'].touched;
  }

  isPasswordFieldInvalid(): boolean {
    return !this.signupForm.controls['password'].valid && this.signupForm.controls['password'].touched;
  }

  async signupUser(): Promise<void> {
    if (!this.signupForm.valid) {
      console.error('Form is not valid yet: ', this.signupForm.value);
      return new Promise<void>(null);
    }

    const email = this.signupForm.value.email;
    const password = this.signupForm.value.password;

    this.authService.signupUser(email, password).then(
      () => {
        this.loading.dismiss().then(() => {
          this.router.navigateByUrl('home');
        });
      },
      error => {
        this.loading.dismiss().then(async () => {
          const alert = await this.alertCtrl.create({
            message: error.message,
            buttons: [{text: 'Ok', role: 'cancel'}],
          });
          await alert.present();
        });
      }
    );

    this.loading = await this.loadingCtrl.create();
    await this.loading.present();
  }
}

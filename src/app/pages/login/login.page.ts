import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/user/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
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
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    });
  }

  isEmailFieldInvalid(): boolean {
    return !this.loginForm.controls['email'].valid && this.loginForm.controls['email'].touched;
  }

  isPasswordFieldInvalid(): boolean {
    return !this.loginForm.controls['password'].valid && this.loginForm.controls['password'].touched;
  }

  async loginUser(): Promise<void> {
    if (!this.loginForm.valid) {
      console.error('Form is not valid yet: ', this.loginForm.value);
      return new Promise<void>(null);
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authService.loginUser(email, password).then(
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

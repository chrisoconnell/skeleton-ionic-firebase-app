import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/user/auth.service';
import { AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  resetPasswordForm: FormGroup;

  constructor(
    private authService: AuthService,
    private alertCtrl: AlertController,
    private formsBuilder: FormBuilder,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.resetPasswordForm = this.formsBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
    });
  }

  resetPassword(): void {
    if (!this.resetPasswordForm.valid) {
      return;
    }

    const email: string = this.resetPasswordForm.value.email;

    this.authService.resetPassword(email).then(
      async () => {
        const alert = await this.alertCtrl.create({
          message: 'Check your email for a password reset link',
          buttons: [
            {
              text: 'Ok',
              role: 'cancel',
              handler: () => {
                this.router.navigateByUrl('login');
              },
            },
          ],
        });
        await alert.present();
      },
      async error => {
        const errorAlert = await this.alertCtrl.create({
          message: error.message,
          buttons: [{text: 'Ok', role: 'cancel'}],
        });

        await errorAlert.present();
      }
    );
  }

  isEmailFieldInvalid(): boolean {
    return !this.resetPasswordForm.controls['email'].valid && this.resetPasswordForm.controls['email'].touched;
  }
}

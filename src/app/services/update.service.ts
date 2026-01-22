import { inject, Injectable, isDevMode } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  private readonly COUNTDOWN_SECONDS = 10;
  private countdown = this.COUNTDOWN_SECONDS;
  private toast?: HTMLIonToastElement;
  private intervalId?: any;
  private updateTriggered = false;

  private swUpdate = inject(SwUpdate);
  private toastController = inject(ToastController);
  private translate = inject(TranslateService);

  init(): void {
    if (!this.swUpdate.isEnabled) {
      return;
    }

    this.swUpdate.versionUpdates.subscribe((event) => {
      if (event.type === 'VERSION_DETECTED') {
        this.startUpdateFlow();
      }
    });

    // Detecta cambios al inicio
    this.swUpdate.checkForUpdate().catch(() => {
      // Puedes dejarlo en silencio en producción
    });
  }

  private async startUpdateFlow(): Promise<void> {
    if (this.updateTriggered) return;
    this.updateTriggered = true;

    await this.presentToast();
    this.startCountdown();
  }

  private async presentToast(): Promise<void> {
    this.toast = await this.toastController.create({
      color: 'warning',
      message: this.getToastMessage(),
      position: 'bottom',
      buttons: [
        {
          text: this.translate.instant('UPDATE.BUTTON'),
          handler: () => this.triggerUpdate(),
        },
      ],
      duration: 0,
    });

    await this.toast.present();
  }

  private startCountdown(): void {
    this.intervalId = setInterval(() => {
      this.countdown = Math.max(0, this.countdown - 1);

      if (this.toast) {
        this.toast.message = this.getToastMessage();
      }

      if (this.countdown <= 0) {
        this.triggerUpdate();
      }
    }, 1000);
  }

  private async triggerUpdate(): Promise<void> {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.toast) await this.toast.dismiss();

    await this.swUpdate.activateUpdate();
    location.reload();
  }

  private getToastMessage(): string {
    return this.translate.instant('UPDATE.MESSAGE', { seconds: this.countdown });
  }
}

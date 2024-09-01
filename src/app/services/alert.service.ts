import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(public Alert: AlertController) { }

  async AlertOnebutton(tittle: string, message: string, textbutton?: string) {
    if (textbutton == undefined) {
      textbutton = 'Aceptar';
    }
    const Popup = await this.Alert.create({
      header: tittle,
      message,
      buttons: [{
        text: textbutton,
        handler: () => {
          Popup.dismiss();

        }}]
    });

    Popup.present();

  }

  async AlertTwobutton(tittle: string, message: string, textbutton?: string, textbutton1?: string) {
    if (textbutton == undefined) {
      textbutton = 'Cancelar';
    }
    if (textbutton1 == undefined) {
      textbutton1 = 'Aceptar';
    }
    const Popup = await this.Alert.create({header: tittle,
      message,
      buttons: [{
        text: textbutton,
        handler: () => {
          Popup.dismiss();

        }}, {
          text: textbutton1,
          role: 'cancel',
          handler: () => {
            Popup.dismiss();

          }}]
    });

    Popup.present();

  }

  async AlertOneButton(title: string, template: any, buttonText?: string | undefined, callback?: (() => void) | undefined) {
    let textButton = 'OK';
    if (buttonText != undefined) { textButton = buttonText; }
    const alert = await this.Alert.create({
        header: title,
        message: template,
        buttons: [{
            text: textButton,
            role: 'cancel',
            handler: () => {
                if (callback !== undefined) {
                    callback();

                }
            }
        }]
    });

    alert.present();

}

async AlertTowButtons(title: any, template: any, buttonText: any, callback: () => void, fail?: (() => void) | undefined) {
  const alert = await this.Alert.create({
   header: title,
   message: template,
   buttons: [
     {
       text: 'Cancelar',
       role: 'cancel',
       handler: () => {
        if (fail !== undefined) {
          fail();

        }
       }
     },
     {
       text: buttonText,
       handler: () => {
        callback();

       }
     }
   ]
 });

  alert.present();

}
async AlertTowButtonss(title: any, template: any, buttonText: any, callback: (arg0: boolean) => void, fail?: (() => void) | undefined) {
  const alert = await this.Alert.create({
   header: title,
   message: template,
   buttons: [
     {
       text: 'Cancelar',
       role: 'cancel',
       handler: () => {
        if (fail !== undefined) {
          fail();

        }
       }
     },
     {
       text: buttonText,
       handler: () => {
        callback(true);

       }
     }
   ]
 });

  alert.present();

}
}

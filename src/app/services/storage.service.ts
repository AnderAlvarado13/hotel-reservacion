import { Injectable } from "@angular/core";
import * as CryptoJs from "crypto-js";


@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private encryptKey = "$2a$10$QUWe9KQyuFRkyRC4fxci6ehRH.cCVywTXg4E1uzZirHL8JfxaXCCi==";
    
    /* FUNCION PARA ENCRYPTAR TODO DATO QUE SE GUARDE EN ALGUN STORAGE */
    encryptData(data: any): string {
      const encryptedData = CryptoJs.AES.encrypt(JSON.stringify(data), this.encryptKey).toString();
      return encryptedData
    }

    /* FUNCION PARA DESENCRIPTAR TODO EL STORAGE */
    decryptData(encryptedData: any): any {
        const bytes = CryptoJs.AES.decrypt(encryptedData, this.encryptKey);
        const decryptData = JSON.parse(bytes.toString(CryptoJs.enc.Utf8));
        return decryptData;
    }
}
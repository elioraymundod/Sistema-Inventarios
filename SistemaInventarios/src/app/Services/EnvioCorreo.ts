import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnvioCorreoService {
  baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = environment.baseUrl;
   }

   public enviarCorreo(datosCorreo: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/enviarCorreo`, datosCorreo);
   }
}
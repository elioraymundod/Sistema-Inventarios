import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TarjetasService {
    baseUrl: string;

    constructor(private http: HttpClient) {
        this.baseUrl = environment.baseUrl;
    }

    public getTarjeta(nombre: any, numero: any, cvv: any, fecha: any): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/get/tarjeta/${nombre}/${numero}/${cvv}/${fecha}`);
    }
}
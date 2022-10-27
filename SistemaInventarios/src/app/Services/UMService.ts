import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UMService {
    baseUrl: string;

    constructor(private http: HttpClient) {
        this.baseUrl = environment.baseUrl;
    }

    public insertUM(um: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/um`, um)
    }

    public getAllUM(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/get/um`);
    }

    public getUMByCodigo(codigo: any): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/get/um/${codigo}`);
    }

    public updateUM(um: any): Observable<any> {
        return this.http.put(`${this.baseUrl}/actualizar/um`, um)
    }
}
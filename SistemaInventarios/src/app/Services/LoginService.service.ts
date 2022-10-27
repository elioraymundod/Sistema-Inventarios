import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    baseUrl: string;
    public userValid: boolean;
    public login: string;
    public datosLogin: any;

    constructor(private http: HttpClient) {
        this.baseUrl = environment.baseUrl;
        this.userValid = false;
        this.login = '';
    }

    public updateUsuario(usuario: any): Observable<any> {
        return this.http.put(`${this.baseUrl}/actualizar/usuario`, usuario)
    }

    public insertUsuario(usuario: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/usuarios`, usuario)
    }

    public getUserByLoginAndPass(user: any, pass: any): Observable<any> {
        this.login = user;
        return this.http.get<any>(`${this.baseUrl}/get/usuarios/${user}/${pass}`);
    }

    public getAllUsers(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/get/all/usuarios`);
    }

    public getCatalogoByCodigo(codigo: any): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/get/catalogo/${codigo}`);
    }

}
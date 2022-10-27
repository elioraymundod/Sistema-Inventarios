import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CategoriasService {
    baseUrl: string;

    constructor(private http: HttpClient) {
        this.baseUrl = environment.baseUrl;
    }

    public insertCategoria(categoria: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/categorias`, categoria)
    }

    public getAllCategorias(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/get/categorias`);
    }

    public getCategoriaByCodigo(codigo: any): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/get/categoria/${codigo}`);
    }

    public updateCategoria(categoria: any): Observable<any> {
        return this.http.put(`${this.baseUrl}/actualizar/categoria`, categoria)
    }
}
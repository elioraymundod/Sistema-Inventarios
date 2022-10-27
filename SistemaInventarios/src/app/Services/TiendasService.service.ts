import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TiendasService {
  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.baseUrl;
  }

  public insertTienda(tienda: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/tiendas`, tienda)
  }

  public getAllTiendas(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get/tiendas`);
  }

}
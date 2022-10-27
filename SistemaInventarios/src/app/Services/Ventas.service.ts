import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class VentasService {
    baseUrl: string;

    constructor(private http: HttpClient) {
        this.baseUrl = environment.baseUrl;
    }

    public insertDetalleVenta(dVenta: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/ventas/detalle`, dVenta)
    }

    public insertVenta(venta: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/ventas`, venta)
    }

    public getAllVentas(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/get/all/ventas`);
    }
}
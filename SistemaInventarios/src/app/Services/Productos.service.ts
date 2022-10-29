import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductosService {
    baseUrl: string;
    public tiempo: any;
    public distancia: any;
    public gastosEnvio: any;

    constructor(private http: HttpClient) {
        this.baseUrl = environment.baseUrl;
    }

    public insertProducto(producto: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/productos`, producto)
    }

    public getAllProducto(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/get/productos`);
    }

    public getCategoriaByCodigo(codigo: any): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/get/categoria/${codigo}`);
    }

    public updateCategoria(categoria: any): Observable<any> {
        return this.http.put(`${this.baseUrl}/actualizar/categoria`, categoria)
    }

    public getProductoByTienda(idProducto: any, idTienda: any): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/get/productos/idproducto/idtienda/${idProducto}/${idTienda}`);
    }

    public insertProductoTienda(producto: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/productos/tiendas`, producto)
    }

    public sumarCantidad(producto: any): Observable<any> {
        return this.http.put(`${this.baseUrl}/actualizar/cantidad/producto`, producto)
    }

    public getTotalProductos(idProducto: any): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/get/total/productos/${idProducto}`);
    }

    public updateTotalProducto(producto: any): Observable<any> {
        return this.http.put(`${this.baseUrl}/put/actualizar/cantidad/producto`, producto)
    }

    
}
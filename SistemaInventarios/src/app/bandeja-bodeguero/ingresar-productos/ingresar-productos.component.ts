import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/Services/LoginService.service';
import { ProductosService } from 'src/app/Services/Productos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ingresar-productos',
  templateUrl: './ingresar-productos.component.html',
  styleUrls: ['./ingresar-productos.component.css']
})
export class IngresarProductosComponent implements OnInit {

  formData: UntypedFormGroup;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['producto', 'categoria', 'unidadMedida', 'existencias', 'accion'];
  formIngresarProducto: UntypedFormGroup;
  productoSeleccionado: number = 0;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private productosService: ProductosService,
    private loginService: LoginService,
    private router: Router) {
    this.formData = this._formBuilder.group({
      filtro: ['']
    });

    this.formIngresarProducto = this._formBuilder.group({
      cantidad: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.obtenerProductos();
  }

  setValues(data: any) {
    this.productoSeleccionado = data.idProducto
  }

  obtenerProductos() {
    this.productosService.getAllProducto().subscribe(res => {
      const productos = res.map((element: any) => {
        this.productosService.getProductoByTienda(element.idProducto, this.loginService.datosLogin[0].tienda_asignada).subscribe(res => {
          if(res.length >0 ){
            element.existencia = res[0].cantidad
          } else {
            element.existencia = 0;
          }
        })
      })
      this.dataSource.data = res;
    }, err => {

    })
  }

  guardarCantidad(data: any){
    this.productosService.getProductoByTienda(this.productoSeleccionado, this.loginService.datosLogin[0].tienda_asignada).subscribe(res => {
      if(res.length == 0) {
        const datos = {
          id_producto: this.productoSeleccionado,
          id_tienda: this.loginService.datosLogin[0].tienda_asignada,
          cantidad: data.cantidad
        }
        this.productosService.insertProductoTienda(datos).subscribe(res => {
          Swal.fire({
            icon: 'success',
            title: 'Ingreso almacenado con exito'
          })
        }, err => {
          Swal.fire({
            icon: 'error',
            title: 'Ha ocurrido un error, por favor intente mas tarde'
          })
        })
        this.obtenerProductos();
      }else {
        const datos = {
          cantidad: Number(data.cantidad) + res[0].cantidad,
          id_producto: this.productoSeleccionado,
          id_tienda: this.loginService.datosLogin[0].tienda_asignada
        }
       this.productosService.sumarCantidad(datos).subscribe(res=>{
          Swal.fire({
            icon: 'success',
            title: 'Ingreso almacenado con exito'
          })
        }, err =>{
          Swal.fire({
            icon: 'error',
            title: 'Ha ocurrido un error, por favor intente mas tarde'
          })
        })
        this.obtenerProductos();
      }
    })
    this.formIngresarProducto.reset();
  }

  volverBandejaBodeguero() {
    this.router.navigate(['bandeja-bodeguero']);
  }

  volverInventario() {
    this.router.navigate(['inventario']);
  }

  cerrarSesion() {
    this.loginService.userValid = false;
    this.router.navigate(['login']);
  }

}

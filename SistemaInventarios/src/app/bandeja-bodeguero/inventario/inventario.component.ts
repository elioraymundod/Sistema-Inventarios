import { DataSource } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CategoriasService } from 'src/app/Services/CategoriasService';
import { LoginService } from 'src/app/Services/LoginService.service';
import { ProductosService } from 'src/app/Services/Productos.service';
import { UMService } from 'src/app/Services/UMService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ["categoria", "producto", "unidadMedida", "precio"]
  filtroFormGroup: UntypedFormGroup;
  formNuevoProducto: UntypedFormGroup;
  categorias: any = [];
  unidadesMedida: any = [];
  date: Date;


  constructor(private router: Router,
    private _formBuilder: UntypedFormBuilder,
    private umService: UMService,
    private categoriaService: CategoriasService,
    private loginService: LoginService,
    private datePipe: DatePipe,
    private productosService: ProductosService) {
    this.filtroFormGroup = this._formBuilder.group({
      filtro: ['']
    });

    this.formNuevoProducto = this._formBuilder.group({
      nombre: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      unidadMedida: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      descripcion: ['', [Validators.required]]
    });

    this.date = new Date();
  }

  ngOnInit() {
    this.obtenerProductos();
    this.getCategorias();
    this.getUM();
  }

  filtrar(event: Event){
    const filterValue = (event?.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  crearProducto(data: any) {
    const producto = {
      nombre: data.nombre,
      precio_unitario: data.precio,
      unidad_medida: data.unidadMedida,
      categoria: data.categoria,
      descripcion: data.descripcion,
      usuario_agrega: this.loginService.login,
      fecha_agrega: this.datePipe.transform(this.date, 'yyyy-MM-dd HH:mm:ss'),
      ip_agrega: "0.0.0.0"
    }

    this.productosService.insertProducto(producto).subscribe(res => {
      Swal.fire({
        icon: 'success',
        title: 'Producto agregado exitosamente'
      });
      this.obtenerProductos();
    }, err => {
      Swal.fire({
        icon: 'error',
        title: 'Ha ocurrido un error, por favor intente mas tarde.'
      })
    })
  }

  obtenerProductos() {
    this.productosService.getAllProducto().subscribe(res => {
      this.dataSource.data = res;
      console.log('res', res)
    }, err=> {

    })
  }

  volverBandejaBodeguero() {
    this.router.navigate(['bandeja-bodeguero']);
  }

  verIngresarProductos() {
    this.router.navigate(['bandeja-bodeguero/ingresar-productos']);
  }

  administrarCategorias(){
    this.router.navigate(['administrar-categorias']);
  }

  administrarUnidadesDeMedida(){
    this.router.navigate(['administrar-um']);
  }

  setValues(data: any) {

  }

  getCategorias(){
    this.categoriaService.getAllCategorias().subscribe(res => {
      this.categorias = res;
    })
  }

  getUM(){
    this.umService.getAllUM().subscribe(res => {
      this.unidadesMedida = res;
    })
  }

}

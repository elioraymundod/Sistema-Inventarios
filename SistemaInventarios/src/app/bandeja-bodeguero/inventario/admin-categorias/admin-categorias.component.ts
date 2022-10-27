import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CategoriasService } from 'src/app/Services/CategoriasService';
import { LoginService } from 'src/app/Services/LoginService.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-categorias',
  templateUrl: './admin-categorias.component.html',
  styleUrls: ['./admin-categorias.component.css']
})
export class AdminCategoriasComponent implements OnInit {

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ["nombre", "descripcion", "accion"];
  filtroFormGroup: UntypedFormGroup;
  formNuevaCategoria: UntypedFormGroup;
  formEditarCategoria: UntypedFormGroup;
  date: Date;

  constructor(private router: Router,
    private loginService: LoginService,
    private categoriasService: CategoriasService,
    private _formBuilder: UntypedFormBuilder,
    private datePipe: DatePipe) {
    this.filtroFormGroup = this._formBuilder.group({
      filtro: ['']
    });

    this.formNuevaCategoria = this._formBuilder.group({
      id: [''],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });

    this.formEditarCategoria = this.formNuevaCategoria;

    this.date = new Date();
  }

  async ngOnInit() {
    await this.obtenerCategorias();
  }

  filtro(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  resetForm(){
    this.formNuevaCategoria.reset();
  }

  volverInventario() {
    this.router.navigate(['inventario']);
  }

  volverMenuPrincipal() {
    this.router.navigate(['bandeja-bodeguero']);
  }

  cerrarSesion() {
    this.router.navigate(['login']);
    this.loginService.userValid = false;
  }

  setValues(data: any) {
    this.formEditarCategoria.get('id')?.setValue(data.id);
    this.formEditarCategoria.get('nombre')?.setValue(data.nombre);
    this.formEditarCategoria.get('descripcion')?.setValue(data.descripcion);
  }

  crearCategorias(data: any){
    const categoria = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      fecha_agrega: this.datePipe.transform(this.date, 'yyyy-MM-dd HH:mm:ss'),
      usuario_agrega: this.loginService.login,
      ip_agrega: '0.0.0.0'
    }
    this.categoriasService.insertCategoria(categoria).subscribe(res => {
      Swal.fire({
        icon: 'success',
        title: 'Categoria agregada exitosamente'
      });
      this.obtenerCategorias();
      this.formNuevaCategoria.reset();
    }, err => {
      Swal.fire({
        icon: 'error',
        title: 'Ha ocurrido un error, por favor intente mas tarde.'
      })
    })
  }

  async obtenerCategorias(){
    await this.categoriasService.getAllCategorias().subscribe(res => {
      this.dataSource.data = res;
    }, err=> {
      Swal.fire({
        icon: 'error',
        title: 'Ha ocurrido un error, por favor intente mas tarde'
      })
    })
  }



  modificarCategoria(data: any){
    const categoria = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      usuario_modifica: this.loginService.login,
      fecha_modifica: this.datePipe.transform(this.date, 'yyyy-MM-dd HH:mm:ss'),
      ip_modifica: "0.0.0.0",
      id: data.id
    }
    this.categoriasService.updateCategoria(categoria).subscribe(res => {
      Swal.fire({
        icon: 'success',
        title: 'Categoria actualizada con exito'
      });
      this.obtenerCategorias();
    }, err=> {
      Swal.fire({
        icon: 'error',
        title: 'Ha ocurrido un error, por favor intente mas tarde'
      })
    })
  }
}

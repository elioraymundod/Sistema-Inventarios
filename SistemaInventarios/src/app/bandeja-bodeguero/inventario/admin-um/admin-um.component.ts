import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/Services/LoginService.service';
import { UMService } from 'src/app/Services/UMService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-um',
  templateUrl: './admin-um.component.html',
  styleUrls: ['./admin-um.component.css']
})
export class AdminUMComponent implements OnInit {

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ["nombre", "abrebiacion", "accion"];
  filtroFormGroup: UntypedFormGroup;
  nuevaUMGroup: UntypedFormGroup;
  editarUMGroup: UntypedFormGroup;
  date: Date;


  constructor(private router: Router,
    private loginService: LoginService,
    private umService: UMService,
    private datePipe: DatePipe,
    private _formBuilder: UntypedFormBuilder) {
    this.filtroFormGroup = this._formBuilder.group({
      filtro: ['']
    });

    this.nuevaUMGroup = this._formBuilder.group({
      id: [''],
      nombre: ['', Validators.required],
      abrebiacion: ['', Validators.required]
    });

    this.editarUMGroup = this.nuevaUMGroup;

    this.date = new Date();
  }

  ngOnInit() {
    this.obtenerUM();
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  resetForm() {
    this.nuevaUMGroup.reset();
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

  setValues(data: any){
    this.editarUMGroup.get('id')?.setValue(data.id);
    this.editarUMGroup.get('nombre')?.setValue(data.nombre);
    this.editarUMGroup.get('abrebiacion')?.setValue(data.abrebiacion);
  }

  crearUM(data: any){
    const um = {
      nombre: data.nombre,
      abrebiacion: data.abrebiacion,
      fecha_agrega: this.datePipe.transform(this.date, 'yyyy-MM-dd HH:mm:ss'),
      usuario_agrega: this.loginService.login,
      ip_agrega: '0.0.0.0'
    }
    this.umService.insertUM(um).subscribe(res => {
      Swal.fire({
        icon: 'success',
        title: 'Unidad de Medida agregada exitosamente'
      });
      this.obtenerUM();
      this.nuevaUMGroup.reset();
    }, err => {
      Swal.fire({
        icon: 'error',
        title: 'Ha ocurrido un error, por favor intente mas tarde.'
      })
    })
  }

  modificarUM(data: any){
    const um = {
      nombre: data.nombre,
      abrebiacion: data.abrebiacion,
      usuario_modifica: this.loginService.login,
      fecha_modifica: this.datePipe.transform(this.date, 'yyyy-MM-dd HH:mm:ss'),
      ip_modifica: "0.0.0.0",
      id: data.id
    }

    this.umService.updateUM(um).subscribe(res => {
      Swal.fire({
        icon: 'success',
        title: 'Se actualizo la unidad de medida correctamente'
      })
      this.obtenerUM();
    }, err=> {
      Swal.fire({
        icon: 'error',
        title: 'Ha ocurrido un error, por favor intente mas tarde'
      })
    })

  }

  obtenerUM(){
    this.umService.getAllUM().subscribe(res => {
      this.dataSource.data = res;
    }, err=> {
      Swal.fire({
        icon: 'error',
        title: 'Ha ocurrido un error, por favor intente mas tarde'
      })
    })
  }

}

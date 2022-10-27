import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from '../Services/LoginService.service';
import { TiendasService } from '../Services/TiendasService.service';
declare let $: any;

@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css']
})
export class AdminUsuariosComponent implements OnInit {

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['usuario', 'nombreUsuario', 'rol', 'accion']; //'tiendaAsignada',
  formData: UntypedFormGroup;
  formNuevoUsuario: UntypedFormGroup;
  formEditarUsuario: UntypedFormGroup;
  show = false;
  tiendas: any = [];
  roles: any = [];
  date: Date;


  constructor(private loginService: LoginService,
    private router: Router,
    private _formBuilder: UntypedFormBuilder,
    private tiendasService: TiendasService,
    private datePipe: DatePipe) {

    this.formData = this._formBuilder.group({
      filtro: ['']
    });

    this.formNuevoUsuario = this._formBuilder.group({
      nombre: ['', [Validators.required]],
      usuario: ['', [Validators.required]],
      contrasena: ['', [Validators.required]],
      //tienda: ['', [Validators.required]],
      rol: ['', [Validators.required]],
      nit: ['', [Validators.required]]
    });

    this.formEditarUsuario = this.formNuevoUsuario;
    this.date = new Date();
  }

  async ngOnInit() {
    if (this.loginService.userValid == false) {
      this.router.navigate(['login'])
    } else {
      await this.obtenerUsuarios();
      await this.obtenerTiendas();
      await this.obtenerRoles(1);
    }
  }

  resetForm(){
    this.formNuevoUsuario.reset();
  }

  cerrarSesion() {
    this.loginService.userValid = false;
    this.router.navigate(['login']);
  }

  crearUsuario(data: any) {
    const usuario = {
      id: data.nit,
      nombre: data.nombre,
      user: data.usuario,
      pass: data.contrasena,
      rol: data.rol,
      tienda_asignada: 1,
      usuario_agrega: this.loginService.login,
      fecha_agrega: this.datePipe.transform(this.date, 'yyyy-MM-dd HH:mm:ss'),
      ip_agrega: '0.0.0.0',
      estado: 1
    }

    this.loginService.insertUsuario(usuario).subscribe(res => {
      Swal.fire({
        icon: 'success',
        title: 'Usuario creado exitosamente'
      });
      this.formNuevoUsuario.reset();
      this.obtenerUsuarios();
    }, err => {
      Swal.fire({
        icon: 'error',
        title: 'No fue posible almacenar el usuario, por favor intente mas tarde'
      });
    });
    this.show = false;
  }

  verPassword() {
    this.show = !this.show;
  }

  async obtenerUsuarios() {
    await this.loginService.getAllUsers().subscribe(res => {
      this.dataSource.data = res;
    }, err => {
      console.error(err);
    })
  }

  async obtenerTiendas() {
    await this.tiendasService.getAllTiendas().subscribe(res => {
      this.tiendas = res;
    }, err => {
      console.error(err);
    })
  }

  async obtenerRoles(codigo: any) {
    await this.loginService.getCatalogoByCodigo(codigo).subscribe(res => {
      this.roles = res;
    }, err => {
      console.error(err);
    })
  }

  setValues(data: any) {
    this.formEditarUsuario.get('nombre')?.setValue(data.nombre);
    this.formEditarUsuario.get('usuario')?.setValue(data.user);
    this.formEditarUsuario.get('contrasena')?.setValue(data.pass)
    this.formEditarUsuario.get('nit')?.setValue(data.id)
    this.formEditarUsuario.get('rol')?.setValue(data.rol)
    //this.formEditarUsuario.get('tienda')?.setValue(data.tienda_asignada)
  }

  actualizarUsuario(data: any, accion: number) {
    let usuario = {
      nit: data.nit,
      nombre: data.nombre,
      usuario: data.usuario,
      pass: data.contrasena,
      rol: data.rol,
      tienda: 1,
      usuario_modifica: this.loginService.login,
      fecha_modifica: this.datePipe.transform(this.date, 'yyyy-MM-dd HH:mm:ss'),
      ip_modifica: '0.0.0.0',
      estado: accion
    }

    if (accion == 0) {
      Swal.fire({
        title: 'Esta seguro de eliminar el usuario?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'No',
        denyButtonText: `Si`,
      }).then((result) => {
        if (result.isConfirmed) {
        } else if (result.isDenied) {
          this.loginService.updateUsuario(usuario).subscribe(res => {
            Swal.fire({
              icon: 'success',
              title: 'Se elimino el usuario correctamente'
            });
            this.obtenerUsuarios();
          }, err => {
            Swal.fire({
              icon: 'error',
              title: 'No fue posible eliminar el usuario, por favor intente mas tarde'
            });
          });
        }
      });
    } else if (accion == 1) {
      this.loginService.updateUsuario(usuario).subscribe(res => {
        Swal.fire({
          icon: 'success',
          title: 'Se modifico el usuario correctamente'
        });

        this.obtenerUsuarios();
      }, err => {
        Swal.fire({
          icon: 'error',
          title: 'No fue posible almacenar la informacion, por favor intente mas tarde'
        });
      });
    }
  }

}

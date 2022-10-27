import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from '../Services/LoginService.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  datosFormGroup: UntypedFormGroup;
  public userValid: boolean;

  constructor(private _formBuilder: UntypedFormBuilder,
    private loginService: LoginService,
    private router: Router) {
    this.userValid = false;

    this.datosFormGroup = this._formBuilder.group({
      loginFormControl: ['', [Validators.required]],
      passFormControl: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {

  }

  async iniciarSesion(datos: any) {
    await this.loginService.getUserByLoginAndPass(datos.loginFormControl, datos.passFormControl).subscribe(res => {
      this.loginService.datosLogin = res;
      if (res.length > 0) {
        this.loginService.userValid = true;
        switch (res[0].rol) {
          case 1:
            this.router.navigate(['administracion-usuarios']);
            break;

          case 2:
            this.router.navigate(['bandeja-vendedor']);
            break;

          case 3:
            this.router.navigate(['bandeja-bodeguero']);
            break;
        }
      } else {
        this.loginService.userValid = false;
        Swal.fire({
          title: 'Usuario y/o contraseña incorrectos',
          icon: 'error'
        });
      }
    }, err => {
      console.error(err)
    })
  }

}

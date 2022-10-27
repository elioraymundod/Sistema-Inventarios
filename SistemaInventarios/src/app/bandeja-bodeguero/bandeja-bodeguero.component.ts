import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../Services/LoginService.service';

@Component({
  selector: 'app-bandeja-bodeguero',
  templateUrl: './bandeja-bodeguero.component.html',
  styleUrls: ['./bandeja-bodeguero.component.css']
})
export class BandejaBodegueroComponent implements OnInit {

  cantidadNotificaciones: Number;

  constructor(private router: Router,
              private loginService: LoginService) {
    this.cantidadNotificaciones = 5;
   }

  async ngOnInit() {
    if (this.loginService.userValid == false) {
      this.router.navigate(['login'])
    } else {

    }
  }

  verInventario(){
    this.router.navigate(['inventario']);
  }

  cerrarSesion() {
    this.loginService.userValid = false;
    this.router.navigate(['login']);
  }
}

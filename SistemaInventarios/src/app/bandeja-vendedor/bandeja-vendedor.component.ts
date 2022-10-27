import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-bandeja-vendedor',
  templateUrl: './bandeja-vendedor.component.html',
  styleUrls: ['./bandeja-vendedor.component.css']
})
export class BandejaVendedorComponent implements OnInit {

  cantidadNotificaciones: Number;

  constructor() { 
    this.cantidadNotificaciones = 5;
  }

  ngOnInit(): void {
  }

}

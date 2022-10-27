import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Categorias } from 'src/app/compras-online/compras-online.component';

@Component({
  selector: 'app-realizar-venta',
  templateUrl: './realizar-venta.component.html',
  styleUrls: ['./realizar-venta.component.css']
})
export class RealizarVentaComponent implements OnInit {
  firstFormGroup: UntypedFormGroup;
  secondFormGroup: UntypedFormGroup;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['categoria', 'producto', 'cantidad', 'precio', 'subtotal'];

  categorias: Categorias[] = [
    {value: '0', viewValue: 'Todas'},
    {value: '1', viewValue: 'Granos'},
    {value: '2', viewValue: 'Pastas'},
  ];

  productos: Categorias[] = [
    {value: '0', viewValue: 'Maiz'},
    {value: '1', viewValue: 'Frijol'},
    {value: '2', viewValue: 'Arroz'},
  ];
  
  constructor(private _formBuilder: UntypedFormBuilder) {
    this.firstFormGroup = this._formBuilder.group({

    });

    this.secondFormGroup = this._formBuilder.group({

    });
  }

  ngOnInit(): void {
  }

}

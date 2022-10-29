import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { VentasService } from '../Services/Ventas.service';

@Component({
  selector: 'app-confirmacion-pedido',
  templateUrl: './confirmacion-pedido.component.html',
  styleUrls: ['./confirmacion-pedido.component.css']
})
export class ConfirmacionPedidoComponent implements OnInit {
  datosConfirmacion: UntypedFormGroup;

  constructor(private _formBuilder: UntypedFormBuilder,
    private ventasService: VentasService) 
  {
    this.datosConfirmacion = this._formBuilder.group({
      codigo: ['', Validators.required]
    })
   }

  ngOnInit(): void {
  }

  validarCodigo(data: any){
    this.ventasService.getCodigoEnvio(data.codigo).subscribe(res => {
      if(res.length == 0){
        Swal.fire({
          'icon': 'error',
          'title': 'Codigo invalido, prueba con otro codigo'
        })
      } else {

        if(res[0].pedido_entregado == 6) {
          Swal.fire({
            'icon': 'info',
            'title': 'Esta venta ya ha sido entregada con anterioridad.'
          })
        } else  if(res[0].pedido_entregado == 5){
          const venta = {
            nuevo_codigo: 6,
            id_venta: res[0].id
          }
          this.ventasService.updateEstadoVenta(venta).subscribe(resp => {
            Swal.fire({
              'icon': 'success',
              'title': 'Venta finalizada con exito.'
            })
          })
        } else {
          Swal.fire({
            'icon': 'info',
            'title': 'Esta venta no esta en fase de ser finalizada.'
          })
        }
        this.datosConfirmacion.reset();
      }
    })
  }
}

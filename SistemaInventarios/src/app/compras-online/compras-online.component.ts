import { Component, OnInit, ElementRef, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
//import { MapCustomService } from '../Services/map-custom.service';
import { ProductosService } from '../Services/Productos.service';
import { VentasService } from '../Services/Ventas.service';
//import { Socket } from "ngx-socket-io";
import { MapService, PlacesService } from '../Services';
import { NgxSpinnerService } from 'ngx-spinner';
import { Map, Popup, Marker } from 'mapbox-gl';
import { TarjetasService } from '../Services/Tarjetas.service';
import { DatePipe } from '@angular/common';
import { EnvioCorreoService } from '../Services/EnvioCorreo';

export interface Categorias {
  value: string;
  viewValue: string;
}

export interface Transaction {
  item: string;
  cost: number;
}

export interface Ventas {

}

export interface DetalleVenta {
  id_venta: number;
  id_producto: number;
  cantidad: number;
  subtotal: number;
  id_tienda: number;
  nombreProducto: string;
  precio_unitario: number;
}

@Component({
  selector: 'app-compras-online',
  templateUrl: './compras-online.component.html',
  styleUrls: ['./compras-online.component.css']
})
export class ComprasOnlineComponent implements OnInit {
  /*@ViewChild('asGeoCoder') asGeoCoder!: ElementRef;
  modeInput = 'end';
  waPoints: WayPoints = { start: null, end: null };*/

  @ViewChild('mapDiv')
  mapDivElement!: ElementRef

  dataSource = new MatTableDataSource();
  dataSourceCarrito = new MatTableDataSource();
  displayedColumns: string[] = ['producto', 'categoria', 'precio', 'um', 'realizarCompra'];
  displayedColumnsCarrito: string[] = ['producto', 'cantidad', 'precio', 'subtotal', 'accion'];
  colorTab: String;
  formCarrito: UntypedFormGroup
  formFiltro: UntypedFormGroup
  formPago: UntypedFormGroup
  formConsultarPedido: UntypedFormGroup
  formContribuyente: UntypedFormGroup
  listaProductos: any[] = [];
  producto: any;
  nombreProducto: string = ''
  totalVentas: number = 0;
  tarjetaValida: boolean = false;
  codigoEnvio: string = '';

  categorias: Categorias[] = [
    { value: '0', viewValue: 'Todas' },
    { value: '1', viewValue: 'Granos' },
    { value: '2', viewValue: 'Pastas' },
  ];

  constructor(
    private productosService: ProductosService,
    private _formBuilder: UntypedFormBuilder,
    private ventasService: VentasService,
    private placesService: PlacesService,
    private spinner: NgxSpinnerService,
    private mapService: MapService,
    private tarjetasService: TarjetasService,
    private datePipe: DatePipe,
    private envioCorreo: EnvioCorreoService
    /*private mapCustomService: MapCustomService, private renderer2: Renderer2,
    private socket: Socket*/
  ) {
    this.colorTab = 'primary',

      this.formCarrito = this._formBuilder.group({
        cantidad: ['', Validators.required]
      })

    this.formFiltro = this._formBuilder.group({
      filtro: ['']
    });

    this.formPago = this._formBuilder.group({
      nombreTarjeta: ['', Validators.required],
      numeroTarjeta: ['', Validators.required],
      cvv: ['', Validators.required],
      fechaExpiracion: ['', Validators.required]
    })

    this.formContribuyente = this._formBuilder.group({
      nit: ['', Validators.required],
      correo: ['', Validators.required]
    })

    this.formConsultarPedido = this._formBuilder.group({
      codigo: ['', Validators.required]
    })
  }



  ngOnInit(): void {
    //this.spinner.show();
    console.log('uslocation', this.placesService.userLocation)
    this.obtenerProductos();
    this.obtenerVentas();

    //Generar codigo envio
    function generaNss() {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      for (let i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
    this.codigoEnvio = generaNss();    
    console.log('El codigo Envio es ', this.codigoEnvio);
  }

  filtrar(event: Event){
    const filterValue = (event?.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  obtenerProductos() {
    this.productosService.getAllProducto().subscribe(res => {
      this.dataSource.data = res;
    }, err => {

    })
  }

  obtenerVentas() {
    this.ventasService.getAllVentas().subscribe(res => {
      this.totalVentas = res.length + 1;
    })
  }

  consultarPedido(data: any) {
    this.ventasService.getCodigoEnvio(data.codigo).subscribe(res => {
      if(res.length == 0) {
        Swal.fire({
          'icon': 'error',
          'title': 'No existe ningun pedido asociado al codigo ingresado'
        })
      } else {
        if(res[0].pedido_entregado == 4) {
          Swal.fire({
            title: 'Lo sentimos, su pedido aun no ha sido enviado, por favor esperar notificacion via correo electronico.',
            width: 600,
            padding: '3em',
            color: '#28B463',
            //background: '#fff url(/images/trees.png)',  #716add    rgba(0,0,123,0.4)
            backdrop: `
              rgba(0.25, 100, 50, 0.5)
              url("./assets/img/homero.gif")
              right bottom
              no-repeat
            `
          })
        } else if (res[0].pedido_entregado == 5){
          Swal.fire({
            title: 'Su pedido ya se encuentra en ruta hacia el lugar indicado.',
            width: 600,
            padding: '3em',
            color: '#716add',
            //background: '#fff url(/images/trees.png)',      
            backdrop: `
              rgba(0,0,123,0.4)
              url("./assets/img/shrek.gif")
              right bottom
              no-repeat
            `
          })
        } else if (res[0].pedido_entregado == 6){
          Swal.fire({
            title: 'Su pedido ya ha sido entregado.',
            width: 600,
            padding: '3em',
            color: '#3498DB',
            //background: '#fff url(/images/trees.png)',      
            backdrop: `
              rgba(0,0,255,0.2)
              url("./assets/img/dance.gif")
              right bottom
              no-repeat
            `
          })
        }
      }
    })
  }

  verCarrito() {
    this.dataSourceCarrito.data = this.listaProductos;
    if (!this.placesService.userLocation) throw Error('no hay user location');
    const map = new Map({
      container: this.mapDivElement.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: this.placesService.userLocation,
      zoom: 13, // starting zoom
      //projection: 'globe' // display the map as a 3D globe
    });

    const popup = new Popup()
      .setHTML(`
             <h6>Tienda de Elio</h6>
             <span>Abarroteria Raymundo</span>
         `);

    new Marker({ color: 'red' })
      .setLngLat(this.placesService.userLocation)
      .setPopup(popup)
      .addTo(map)

    this.mapService.setMap(map);
  }

  getTotalCost() {
    return this.listaProductos.map(t => t.subtotal).reduce((acc, value) => acc + value, 0);
  }


  agregarProducto(producto: any) {
    this.producto = producto;
    this.nombreProducto = this.producto.nombreProducto
  }

  agregarAlCarrito(cantidad: any) {
    this.productosService.getTotalProductos(this.producto.idProducto).subscribe(res => {
      if (res[0].total >= cantidad.cantidad) {
        let nuevoProducto: DetalleVenta = {
          id_producto: this.producto.idProducto,
          id_venta: this.totalVentas,
          cantidad: 0,
          subtotal: 0,
          id_tienda: 0,
          nombreProducto: this.producto.nombreProducto,
          precio_unitario: this.producto.precio_unitario
        };
        let aux: boolean = false;

        console.log('lista producto al inicio', this.listaProductos)
        const productoAgregado = this.listaProductos.map(pr => {
          console.log(pr)
          if (pr.id_producto === this.producto.idProducto) {
            pr.cantidad += Number(this.formCarrito.get('cantidad')?.value)
            pr.subtotal = pr.cantidad * pr.precio_unitario;
            this.listaProductos = [...this.listaProductos]
            // nuevoProducto.cantidad += Number(this.formCarrito.get('cantidad')?.value)
            aux = true;
          }
        })

        if (!aux) {
          nuevoProducto.cantidad = Number(this.formCarrito.get('cantidad')?.value)
          nuevoProducto.subtotal = nuevoProducto.cantidad * nuevoProducto.precio_unitario;
          this.listaProductos = [...this.listaProductos, nuevoProducto]
        }

        console.log('lista producto al final', this.listaProductos)
        this.formCarrito.reset()

        Swal.fire({
          'icon': 'success',
          'title': 'Agregado al carrito con Exito'
        })
      } else {
        this.formCarrito.reset()
        Swal.fire({
          'icon': 'info',
          'title': 'Lo sentimos, actualmente no tenemos en bodega la cantidad de productos que solicitas.'
        })
      }
    })

  }

  sumar(producto: DetalleVenta) {
    this.listaProductos.map(pr => {
      if (pr.id_producto === producto.id_producto) {
        pr.cantidad += 1;
        pr.subtotal += pr.precio_unitario;
        this.listaProductos = [...this.listaProductos]
      }
    })
  }

  restar(producto: DetalleVenta) {
    this.listaProductos.map(pr => {
      if (pr.id_producto === producto.id_producto) {
        if (pr.cantidad === 1) {
          console.log('se filtra', producto.id_producto, producto.id_producto)
          this.listaProductos = this.listaProductos.filter((produc: DetalleVenta) => produc.id_producto !== producto.id_producto)
          this.dataSourceCarrito.data = this.listaProductos
        } else {
          pr.cantidad -= 1;
          pr.subtotal -= pr.precio_unitario;
        }
        this.listaProductos = [...this.listaProductos]
      }
    })

  }

  validarDatosTarjeta(data: any) {
    if (this.formPago.valid) {
      this.tarjetasService.getTarjeta(data.nombreTarjeta, data.numeroTarjeta, data.cvv, data.fechaExpiracion).subscribe(res => {
        if (res.length == 0) {
          Swal.fire({
            icon: 'error',
            title: 'Los datos ingresados son incorrectos, por favor validar'
          })
          this.tarjetaValida = false;
        } else {
          this.tarjetaValida = true;
        }
      })
    }
  }

  finalizarCompra() {
    const venta = {
      direccion: this.placesService.lugarSeleccionado,
      nit: this.formContribuyente.get('nit')?.value,
      correo: this.formContribuyente.get('correo')?.value,
      distancia: this.productosService.distancia,
      monto_envio: this.productosService.gastosEnvio,
      tiempo: this.productosService.tiempo,
      coordenadas_destino: JSON.stringify(this.placesService.coordenadasDestino),
      codigo_envio: this.codigoEnvio,
      pedido_entregado: 4,
      usuario_agrega: 'compras_online',
      ip_agrega: '10.61.3.133',
      fecha_agrega: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      venta_atendida: 4
    }

    this.ventasService.insertVenta(venta).subscribe(res => { });

    this.listaProductos.forEach(producto => {
      const newDetalle = {
        cantidad: producto.cantidad,
        fecha_agrega: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        id_producto: producto.id_producto,
        id_venta: this.totalVentas,
        ip_agrega: '10.61.3.133',
        subtotal: producto.subtotal,
        usuario_agrega: 'compras_online'
      }
      this.productosService.getTotalProductos(producto.id_producto).subscribe(res => {
        const nuevoTotal = {
          cantidad: (Number(res[0].total) - Number(producto.cantidad)),
          id_producto: producto.id_producto
        }
        this.productosService.updateTotalProducto(nuevoTotal).subscribe(res => { })
      })
      this.ventasService.insertDetalleVenta(newDetalle).subscribe(res => { })

    })
    
    this.enviarCorreoPedidoRealizado(this.formContribuyente.get('correo')?.value);
    Swal.fire({
      icon: 'success',
      title: 'Venta realizada con exito, se le notificara cuando sea enviado su pedido.'
    })
    this.listaProductos = [];
    this.formContribuyente.reset();
    this.formPago.reset();
    this.dataSourceCarrito.data = [];
    //JSON.parse(venta.coordenadas_destino)
  }

  enviarCorreoPedidoRealizado(email: any){
    const datosCorreo = {
      paraCorreo: email,
      asuntoCorreo: 'Pedido ingresado',
      cuerpoCorreo: '',
      htmlCorreo: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="font-family:arial, 'helvetica neue', helvetica, sans-serif">
       <head>
        <meta charset="UTF-8">
        <meta content="width=device-width, initial-scale=1" name="viewport">
        <meta name="x-apple-disable-message-reformatting">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="telephone=no" name="format-detection">
        <title>Nuevo mensaje 2</title><!--[if (mso 16)]>
          <style type="text/css">
          a {text-decoration: none;}
          </style>
          <![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
      <xml>
          <o:OfficeDocumentSettings>
          <o:AllowPNG></o:AllowPNG>
          <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
      </xml>
      <![endif]--><!--[if !mso]><!-- -->
        <link href="https://fonts.googleapis.com/css2?family=Orbitron&display=swap" rel="stylesheet"><!--<![endif]-->
        <style type="text/css">
      #outlook a {
        padding:0;
      }
      .es-button {
        mso-style-priority:100!important;
        text-decoration:none!important;
      }
      a[x-apple-data-detectors] {
        color:inherit!important;
        text-decoration:none!important;
        font-size:inherit!important;
        font-family:inherit!important;
        font-weight:inherit!important;
        line-height:inherit!important;
      }
      .es-desk-hidden {
        display:none;
        float:left;
        overflow:hidden;
        width:0;
        max-height:0;
        line-height:0;
        mso-hide:all;
      }
      [data-ogsb] .es-button {
        border-width:0!important;
        padding:10px 20px 10px 20px!important;
      }
      @media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120% } h1 { font-size:30px!important; text-align:left } h2 { font-size:24px!important; text-align:left } h3 { font-size:20px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important; text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:24px!important; text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important; text-align:left } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:14px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button, button.es-button { font-size:18px!important; display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0!important } .es-m-p0r { padding-right:0!important } .es-m-p0l { padding-left:0!important } .es-m-p0t { padding-top:0!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; max-height:inherit!important } .es-m-p5 { padding:5px!important } .es-m-p5t { padding-top:5px!important } .es-m-p5b { padding-bottom:5px!important } .es-m-p5r { padding-right:5px!important } .es-m-p5l { padding-left:5px!important } .es-m-p10 { padding:10px!important } .es-m-p10t { padding-top:10px!important } .es-m-p10b { padding-bottom:10px!important } .es-m-p10r { padding-right:10px!important } .es-m-p10l { padding-left:10px!important } .es-m-p15 { padding:15px!important } .es-m-p15t { padding-top:15px!important } .es-m-p15b { padding-bottom:15px!important } .es-m-p15r { padding-right:15px!important } .es-m-p15l { padding-left:15px!important } .es-m-p20 { padding:20px!important } .es-m-p20t { padding-top:20px!important } .es-m-p20r { padding-right:20px!important } .es-m-p20l { padding-left:20px!important } .es-m-p25 { padding:25px!important } .es-m-p25t { padding-top:25px!important } .es-m-p25b { padding-bottom:25px!important } .es-m-p25r { padding-right:25px!important } .es-m-p25l { padding-left:25px!important } .es-m-p30 { padding:30px!important } .es-m-p30t { padding-top:30px!important } .es-m-p30b { padding-bottom:30px!important } .es-m-p30r { padding-right:30px!important } .es-m-p30l { padding-left:30px!important } .es-m-p35 { padding:35px!important } .es-m-p35t { padding-top:35px!important } .es-m-p35b { padding-bottom:35px!important } .es-m-p35r { padding-right:35px!important } .es-m-p35l { padding-left:35px!important } .es-m-p40 { padding:40px!important } .es-m-p40t { padding-top:40px!important } .es-m-p40b { padding-bottom:40px!important } .es-m-p40r { padding-right:40px!important } .es-m-p40l { padding-left:40px!important } }
      </style>
       </head>
       <body data-new-gr-c-s-loaded="14.1085.0" style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
        <div class="es-wrapper-color" style="background-color:#CEEAF4"><!--[if gte mso 9]>
            <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
              <v:fill type="tile" color="#ceeaf4"></v:fill>
            </v:background>
          <![endif]-->
         <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#CEEAF4">
           <tr>
            <td valign="top" style="padding:0;Margin:0">
             <table cellpadding="0" cellspacing="0" class="es-header" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
               <tr>
                <td align="center" style="padding:0;Margin:0">
                 <table bgcolor="#ffffff" class="es-header-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px">
                   <tr>
                    <td align="left" style="padding:20px;Margin:0">
                     <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                       <tr>
                        <td class="es-m-p0r" valign="top" align="center" style="padding:0;Margin:0;width:560px">
                         <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                           <tr>
                            <td align="center" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#068FC1;font-size:14px"><img src="https://acmktv.stripocdn.email/content/guids/CABINET_79c105c819d9bc5c078b61dd38cef0b6/images/group_116.png" alt="Logo" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="60" title="Logo"></a></td>
                           </tr>
                         </table></td>
                       </tr>
                     </table></td>
                   </tr>
                 </table></td>
               </tr>
             </table>
             <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
               <tr>
                <td align="center" style="padding:0;Margin:0">
                 <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                   <tr>
                    <td align="left" style="padding:0;Margin:0">
                     <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                       <tr>
                        <td class="es-m-p0r es-m-p20b" valign="top" align="center" style="padding:0;Margin:0;width:600px">
                         <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                           <tr>
                            <td align="center" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#068FC1;font-size:14px"><img class="adapt-img" src="https://acmktv.stripocdn.email/content/guids/CABINET_79c105c819d9bc5c078b61dd38cef0b6/images/4283974_17826converted_h6N.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="600"></a></td>
                           </tr>
                         </table></td>
                       </tr>
                     </table></td>
                   </tr>
                 </table></td>
               </tr>
             </table>
             <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
               <tr>
                <td align="center" style="padding:0;Margin:0">
                 <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                   <tr>
                    <td align="left" style="padding:0;Margin:0;padding-left:20px;padding-right:20px;padding-bottom:30px">
                     <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                       <tr>
                        <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                         <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                           <tr>
                            <td align="center" class="es-m-txt-c es-m-p0r es-m-p0l" style="padding:0;Margin:0;padding-left:40px;padding-right:40px"><h1 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:Orbitron, sans-serif;font-size:30px;font-style:normal;font-weight:bold;color:#455A64">Gracias por usar nuestra pagina web, puedes rastrear tu pedido con el siguiente codigo: ${this.codigoEnvio}</h1></td>
                           </tr>
                           <tr>
                            <td align="center" style="padding:0;Margin:0;padding-top:20px"><!--[if mso]><a href="http://localhost:4200/compras-sistema-ventas" target="_blank" hidden>
        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="http://localhost:4200/compras-sistema-ventas" 
                      style="height:41px; v-text-anchor:middle; width:154px" arcsize="24%" stroke="f"  fillcolor="#bd242b">
          <w:anchorlock></w:anchorlock>
          <center style='color:#ffffff; font-family:arial, "helvetica neue", helvetica, sans-serif; font-size:15px; font-weight:400; line-height:15px;  mso-text-raise:1px'>Ir al sitio web</center>
        </v:roundrect></a>
      <![endif]--><!--[if !mso]><!-- --><span class="msohide es-button-border" style="border-style:solid;border-color:#2CB543;background:#BD242B;border-width:0px;display:inline-block;border-radius:10px;width:auto;mso-hide:all"><a href="http://localhost:4200/compras-sistema-ventas" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:18px;border-style:solid;border-color:#BD242B;border-width:10px 20px 10px 20px;display:inline-block;background:#BD242B;border-radius:10px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:normal;font-style:normal;line-height:22px;width:auto;text-align:center">Ir al sitio web</a></span><!--<![endif]--></td>
                           </tr>
                         </table></td>
                       </tr>
                     </table></td>
                   </tr>
                   <tr>
                    <td align="left" style="padding:0;Margin:0">
                     <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                       <tr>
                        <td align="center" valign="top" style="padding:0;Margin:0;width:600px">
                         <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                           <tr>
                            <td align="center" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="http://localhost:4200/compras-sistema-ventas" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#068FC1;font-size:14px"><img class="adapt-img" src="https://acmktv.stripocdn.email/content/guids/CABINET_79c105c819d9bc5c078b61dd38cef0b6/images/group_115_mTQ.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="600"></a></td>
                           </tr>
                         </table></td>
                       </tr>
                     </table></td>
                   </tr>
                   <tr>
                    <td align="left" style="Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;padding-bottom:40px"><!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:270px" valign="top"><![endif]-->
                     <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                       <tr>
                        <td class="es-m-p20b" align="left" style="padding:0;Margin:0;width:270px">
                         <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;border-left:1px solid #ceeaf4;border-right:1px solid #ceeaf4;border-top:1px solid #ceeaf4;border-bottom:1px solid #ceeaf4;border-radius:10px" role="presentation">
                           <tr>
                            <td align="center" style="padding:0;Margin:0;padding-top:10px;font-size:0px"><img src="https://acmktv.stripocdn.email/content/guids/CABINET_a82962c5c06ddb807f46cb5118190398/images/foto_perfil.png" alt="Bob" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;font-size:12px" title="Bob" height="138"></td>
                           </tr>
                         </table></td>
                       </tr>
                     </table><!--[if mso]></td><td style="width:20px"></td><td style="width:270px" valign="top"><![endif]-->
                     <table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                       <tr>
                        <td align="left" style="padding:0;Margin:0;width:270px">
                         <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;border-left:1px solid #ceeaf4;border-right:1px solid #ceeaf4;border-top:1px solid #ceeaf4;border-bottom:1px solid #ceeaf4;border-radius:10px" role="presentation">
                           <tr>
                            <td align="center" class="es-m-txt-c" style="padding:0;Margin:0;padding-top:10px;padding-left:10px;padding-right:10px"><h3 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:Orbitron, sans-serif;font-size:20px;font-style:normal;font-weight:bold;color:#455A64">Elio Raymundo</h3><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#455A64;font-size:14px"><br><br></p></td>
                           </tr>
                           <tr>
                            <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-left:10px;padding-right:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#455A64;font-size:14px">Programador de Sistemas</p></td>
                           </tr>
                           <tr>
                            <td align="center" style="padding:10px;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#455A64;font-size:14px">San Raymundo, Guatemala</p></td>
                           </tr>
                         </table></td>
                       </tr>
                     </table><!--[if mso]></td></tr></table><![endif]--></td>
                   </tr>
                 </table></td>
               </tr>
             </table>
             <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
               <tr>
                <td align="center" style="padding:0;Margin:0">
                 <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                   <tr>
                    <td align="left" style="padding:0;Margin:0;padding-left:20px;padding-right:20px">
                     <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                       <tr>
                        <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                         <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                           <tr>
                            <td align="center" style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;font-size:0">
                             <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                               <tr>
                                <td style="padding:0;Margin:0;border-bottom:1px solid #ceeaf4;background:unset;height:1px;width:100%;margin:0px"></td>
                               </tr>
                             </table></td>
                           </tr>
                         </table></td>
                       </tr>
                     </table></td>
                   </tr>
                 </table></td>
               </tr>
             </table>
             <table cellpadding="0" cellspacing="0" class="es-footer" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
               <tr>
                <td align="center" style="padding:0;Margin:0">
                 <table bgcolor="#ffffff" class="es-footer-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                   <tr>
                    <td align="left" style="Margin:0;padding-bottom:20px;padding-left:20px;padding-right:20px;padding-top:40px">
                     <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                       <tr>
                        <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                         <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                           <tr>
                            <td align="center" style="padding:0;Margin:0;padding-top:20px;padding-bottom:30px;font-size:0">
                             <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                               <tr>
                                <td align="center" valign="top" style="padding:0;Margin:0;padding-right:30px"><a target="_blank" href="https://www.facebook.com/elio.isai/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#068FC1;font-size:14px"><img title="Facebook" src="https://acmktv.stripocdn.email/content/assets/img/social-icons/circle-colored/facebook-circle-colored.png" alt="Fb" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td>
                                <td align="center" valign="top" style="padding:0;Margin:0;padding-right:30px"><a target="_blank" href="https://twitter.com/?lang=es" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#068FC1;font-size:14px"><img title="Twitter" src="https://acmktv.stripocdn.email/content/assets/img/social-icons/circle-colored/twitter-circle-colored.png" alt="Tw" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td>
                                <td align="center" valign="top" style="padding:0;Margin:0;padding-right:30px"><a target="_blank" href="https://www.instagram.com/sr_elio/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#068FC1;font-size:14px"><img title="Instagram" src="https://acmktv.stripocdn.email/content/assets/img/social-icons/circle-colored/instagram-circle-colored.png" alt="Inst" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td>
                                <td align="center" valign="top" style="padding:0;Margin:0"><a target="_blank" href="https://www.youtube.com/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#068FC1;font-size:14px"><img title="Youtube" src="https://acmktv.stripocdn.email/content/assets/img/social-icons/circle-colored/youtube-circle-colored.png" alt="Yt" height="24" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td>
                               </tr>
                             </table></td>
                           </tr>
                           <tr>
                            <td align="center" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#455A64;font-size:14px"><br></p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#455A64;font-size:14px">Copyright © 2022 Delivery, All rights reserved.<br><br></p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#455A64;font-size:14px">01060 San Raymundo, Guatemala</p></td>
                           </tr>
                         </table></td>
                       </tr>
                     </table></td>
                   </tr>
                 </table></td>
               </tr>
             </table></td>
           </tr>
         </table>
        </div>
       </body>
      </html>
      `
    }
    console.log('se envia correo a ', datosCorreo)
    this.envioCorreo.enviarCorreo(datosCorreo).subscribe(res => {})
  }
}

export class WayPoints {
  start: any;
  end: any
}
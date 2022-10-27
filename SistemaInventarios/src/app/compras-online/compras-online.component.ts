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
  formContribuyente: UntypedFormGroup
  listaProductos: any[] = [];
  producto: any;
  nombreProducto: string = ''
  totalVentas: number = 0;
  tarjetaValida: boolean = false;

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
    private datePipe: DatePipe
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
  }

  ngOnInit(): void {
    //this.spinner.show();
    console.log('uslocation', this.placesService.userLocation)
    this.obtenerProductos();
    this.obtenerVentas();
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

    new Marker({color: 'red'})
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

  validarDatosTarjeta(data: any){
    if(this.formPago.valid){
      this.tarjetasService.getTarjeta(data.nombreTarjeta, data.numeroTarjeta, data.cvv, data.fechaExpiracion).subscribe(res => {
        if (res.length == 0){
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

  finalizarCompra(){
    const venta = {
      direccion: this.placesService.lugarSeleccionado,
      nit: this.formContribuyente.get('nit')?.value,
      correo: this.formContribuyente.get('correo')?.value,
      distancia: this.productosService.distancia,
      monto_envio: this.productosService.gastosEnvio,
      tiempo: this.productosService.tiempo,
      coordenadas_destino: JSON.stringify(this.placesService.coordenadasDestino),
      usuario_agrega: 'compras_online',
      ip_agrega: '10.61.3.133',
      fecha_agrega: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      venta_atendida: 0
    }

    this.ventasService.insertVenta(venta).subscribe(res => {});

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
        this.productosService.updateTotalProducto(nuevoTotal).subscribe(res => {})
      })
      this.ventasService.insertDetalleVenta(newDetalle).subscribe(res => {})

    })
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
}

export class WayPoints {
  start: any;
  end: any
}
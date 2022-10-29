import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminUsuariosComponent } from './admin-usuarios/admin-usuarios.component';
import { BandejaBodegueroComponent } from './bandeja-bodeguero/bandeja-bodeguero.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MaterialExampleModule } from './material.module';
import { DatePipe } from '@angular/common';
import { MapService, PlacesService } from './Services';
import { LoginService } from './Services/LoginService.service';
import { VentasService } from './Services/Ventas.service';
import { IngresarProductosComponent } from './bandeja-bodeguero/ingresar-productos/ingresar-productos.component';
import { AdminCategoriasComponent } from './bandeja-bodeguero/inventario/admin-categorias/admin-categorias.component';
import { AdminUMComponent } from './bandeja-bodeguero/inventario/admin-um/admin-um.component';
import { InventarioComponent } from './bandeja-bodeguero/inventario/inventario.component';
import { RealizarVentaComponent } from './bandeja-vendedor/realizar-venta/realizar-venta.component';
import { BandejaVendedorComponent } from './bandeja-vendedor/bandeja-vendedor.component';
import { ComprasOnlineComponent } from './compras-online/compras-online.component';
import { LoginComponent } from './login/login.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BtnMyLocationComponent } from './btn-my-location/btn-my-location.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { TarjetasService } from './Services/Tarjetas.service';
import { ConfirmacionPedidoComponent } from './confirmacion-pedido/confirmacion-pedido.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminUsuariosComponent,
    BandejaBodegueroComponent,
    IngresarProductosComponent,
    AdminCategoriasComponent,
    AdminUMComponent,
    InventarioComponent,
    RealizarVentaComponent,
    BandejaVendedorComponent,
    ComprasOnlineComponent,
    LoginComponent,
    BtnMyLocationComponent,
    SearchBarComponent,
    SearchResultsComponent,
    ConfirmacionPedidoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatNativeDateModule,
    MaterialExampleModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  providers: [LoginService, DatePipe, VentasService, PlacesService, MapService, TarjetasService],
  bootstrap: [AppComponent]
})
export class AppModule { }

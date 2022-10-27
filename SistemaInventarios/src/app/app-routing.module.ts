import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminUsuariosComponent } from './admin-usuarios/admin-usuarios.component';
import { BandejaBodegueroComponent } from './bandeja-bodeguero/bandeja-bodeguero.component';
import { IngresarProductosComponent } from './bandeja-bodeguero/ingresar-productos/ingresar-productos.component';
import { AdminCategoriasComponent } from './bandeja-bodeguero/inventario/admin-categorias/admin-categorias.component';
import { AdminUMComponent } from './bandeja-bodeguero/inventario/admin-um/admin-um.component';
import { InventarioComponent } from './bandeja-bodeguero/inventario/inventario.component';
import { BandejaVendedorComponent } from './bandeja-vendedor/bandeja-vendedor.component';
import { RealizarVentaComponent } from './bandeja-vendedor/realizar-venta/realizar-venta.component';
import { ComprasOnlineComponent } from './compras-online/compras-online.component';
import { LoginComponent } from './login/login.component';
//import { MapaComponent } from './mapa/mapa.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'administracion-usuarios', component: AdminUsuariosComponent},
  {path: 'bandeja-bodeguero', component: BandejaBodegueroComponent},
  {path: 'bandeja-bodeguero/ingresar-productos', component: IngresarProductosComponent},
  {path: 'bandeja-vendedor', component: BandejaVendedorComponent},
  {path: 'bandeja-vendedor/realizar-venta', component: RealizarVentaComponent},
  {path: 'compras-sistema-ventas', component: ComprasOnlineComponent},
  {path: 'inventario', component: InventarioComponent},
  {path: 'administrar-categorias', component: AdminCategoriasComponent},
  {path: 'administrar-um', component: AdminUMComponent},
  //{path: 'mapas', component: MapaComponent},
  {path: '**', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Feature } from '../Interfaces/places';
import { MapService, PlacesService } from '../Services';
import { ProductosService } from '../Services/Productos.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  public selectedId: string = '';

  constructor(private placeServices: PlacesService, private mapService: MapService, private productosService: ProductosService) { }


  ngOnInit(): void {
  }

  get isLoadingPlaces() : boolean{
    return this.placeServices.isLoadingPlaces;
  }

  get places(): Feature[] {
    return this.placeServices.places;
  }

  flyTo(place: Feature) {
    this.selectedId = place.id;
    const [lng, lat] = place.center;
    this.mapService.flyTo([lng, lat]);
  }

  getDirections(place: Feature){
    if(!this.placeServices.userLocation) throw Error('No hay userLocation');
    const start = this.placeServices.userLocation!;
    const end = place.center as [number, number];
    this.placeServices.lugarSeleccionado =  place.place_name_es;
    this.placeServices.coordenadasDestino = place.center;
    this.mapService.getRouteBetwenPoints(start, end, true)
  }
}

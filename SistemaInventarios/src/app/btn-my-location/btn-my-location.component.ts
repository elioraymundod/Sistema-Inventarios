import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { MapService, PlacesService } from '../Services';

@Component({
  selector: 'app-btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrls: ['./btn-my-location.component.css']
})
export class BtnMyLocationComponent implements OnInit {

  constructor(private mapService: MapService, private placesService: PlacesService) { }

  ngOnInit(): void {
  }

  goToMyLocation(){
    if(!this.placesService.userLocation) throw Error('No hay ubicacion de usuario');
    if(!this.mapService.isMapReady) throw Error('No hay mapa disponible');

    this.mapService.flyTo(this.placesService.userLocation!);
  }

}

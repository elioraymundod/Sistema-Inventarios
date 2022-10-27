import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Feature, PlacesResponse } from '../Interfaces/places';
import { MapService } from './Maps.service';

@Injectable({
    providedIn: 'root'
})
export class PlacesService {
    @ViewChild('mapDiv')
  mapDivElement!: ElementRef
    public userLocation?: [number, number];
    public isLoadingPlaces: boolean = false;
    public places: Feature[] = [];
    public lugarSeleccionado : any;
    public coordenadasDestino: any;
    //baseUrl: string;

    get isUserLocationReady(): boolean {
        return !!this.userLocation;
    }

    constructor(private http: HttpClient, private spinner: NgxSpinnerService, private mapService: MapService) {
        this.spinner.show();
        //this.baseUrl = environment.baseUrl;
        this.getUserLocation();
    }

    public async getUserLocation(): Promise<[number, number]> {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                ({ coords }) => {
                    this.userLocation = [-90.59919554583382, 14.7584306848187]//[coords.longitude, coords.latitude] , 
                    resolve(this.userLocation);
                }, (err) => {
                    alert('No se pudo obtener la geolocalizacion')
                    console.log(err);
                    reject();
                }
            );
            this.spinner.hide()
        })
    }

    getPlacesByQuery(query: string = '') {
        
        if(query.length === 0 ) {
            this.places = [];
            this.isLoadingPlaces = false;
            return;
        }
        this.isLoadingPlaces = true;
        this.http.get<PlacesResponse>(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?limit=1&proximity=-90.51154385128322%2C14.636153450958588&types=place%2Cpostcode%2Caddress&language=es&access_token=pk.eyJ1IjoiZWlyYXltdW4iLCJhIjoiY2w5ZG9vejhrNG1rMDNwdDVtanp0dmxuMiJ9.EBHCyXlDR8fonaAVzYG5jw`)
            .subscribe( resp => {
                console.log(resp.features)
                this.isLoadingPlaces = false;
                this.places = resp.features;
                this.mapService.createMarkersFromPlaces(this.places, this.userLocation!);
            })
    }
}
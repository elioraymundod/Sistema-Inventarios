import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl'
import Swal from 'sweetalert2';
import { DirectionsResponse, Route } from '../Interfaces/directions';
import { Feature } from '../Interfaces/places';
import { ProductosService } from './Productos.service';

@Injectable({
    providedIn: 'root'
})
export class MapService {

    public map?: Map;
    private markers: Marker[] = [];

    get isMapReady() {
        return !!this.map;
    }

    setMap(map: Map) {
        this.map = map;
    }

    constructor(private http: HttpClient, private productosService: ProductosService) {

    }

    flyTo(coords: LngLatLike) {
        if (!this.isMapReady) throw Error('El mapa no esta inicializado');

        this.map?.flyTo({
            zoom: 14,
            center: coords
        })
    }

    createMarkersFromPlaces(places: Feature[], userLocation: [number, number]) {
        if (!this.map) throw Error('Mapa no inicializado');

        this.markers.forEach(marker => marker.remove());
        const newMarkers = [];

        for (const place of places) {
            const [lng, lat] = place.center;
            const popup = new Popup()
                .setHTML(`
                <h6>${place.text}</h6>
                <span>${place.place_name}</span>
                `);
            const newMarker = new Marker()
                .setLngLat([lng, lat])
                .setPopup(popup)
                .addTo(this.map);

            newMarkers.push(newMarker);
        }
        this.markers = newMarkers;

        if (places.length === 0) return;

        // limites del mapa
        const bounds = new LngLatBounds()
        newMarkers.forEach(marker => bounds.extend(marker.getLngLat()));

        bounds.extend(userLocation);
        this.map.fitBounds(bounds);
        this.map.fitBounds(bounds, {
            padding: 100
        })
    }

    getRouteBetwenPoints(start: [number, number], end: [number, number]) {
        //this.http.get<DirectionsResponse>(`https://api.mapbox.com/directions/v5/mapbox/driving/-74.207422%2C40.832648%3B-74.200118%2C40.8259?alternatives=false&geometries=geojson&language=en&overview=simplified&steps=true&access_token=pk.eyJ1IjoiZWlyYXltdW4iLCJhIjoiY2w5ZG9vejhrNG1rMDNwdDVtanp0dmxuMiJ9.EBHCyXlDR8fonaAVzYG5jw`)
        this.http.get<DirectionsResponse>(`https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]}%2C${start[1]}%3B${end[0]}%2C${end[1]}?alternatives=false&geometries=geojson&language=en&overview=simplified&steps=true&access_token=pk.eyJ1IjoiZWlyYXltdW4iLCJhIjoiY2w5ZG9vejhrNG1rMDNwdDVtanp0dmxuMiJ9.EBHCyXlDR8fonaAVzYG5jw`)
            .subscribe(resp => this.drawPolyLine(resp.routes[0]));
    }

    private drawPolyLine(route: Route) {
        //console.log({ distanciaKms: route.distance / 1000, duration: route.duration / 60 });
        
        this.productosService.distancia = (route.distance / 1000).toFixed(2) + ' kilometros';
        this.productosService.gastosEnvio = (35 * (route.distance / 1000))/10;
        if ((route.duration / 60) < 60) {
            this.productosService.tiempo = (route.duration / 60).toFixed(2) + ' minutos'
        } else {
            this.productosService.tiempo = ((route.duration / 60) / 60).toFixed(2) + ' horas'
        }

        Swal.fire({
            icon: 'info',
            title: 'Se ha detectado una distancia de ' + this.productosService.distancia + ' se le cobrara un total de Q.' +this.productosService.gastosEnvio.toFixed(2) + 
            ' de envio. Su pedido llegara aproximadamente en ' + this.productosService.tiempo + ' despues que reciba un correo electronico indicando que se ha enviado su pedido.'
        })

        if (!this.map) throw Error('Mapa no inicializado');

        const coords = route.geometry.coordinates;
        const bounds = new LngLatBounds();

        coords.forEach(([lng, lat]) => {
            bounds.extend([lng, lat])
        });

        this.map?.fitBounds(bounds, {
            padding: 100
        });

        // Polyline
        const sourceData: AnySourceData = {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates: coords
                        }
                    }
                ]
            }
        }

        if (this.map.getLayer('RouteString')) {
            this.map.removeLayer('RouteString');
            this.map.removeSource('RouteString');
        }

        //Limpiar ruta previa
        this.map.addSource('RouteString', sourceData);
        this.map.addLayer({
            id: 'RouteString',
            type: 'line',
            source: 'RouteString',
            layout: {
                "line-cap": 'round',
                "line-join": 'round'
            },
            paint: {
                "line-color": 'green',
                "line-width": 3
            }
        })
    }
}
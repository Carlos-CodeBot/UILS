import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-post-rut',
  templateUrl: './post-rut.page.html',
  styleUrls: ['./post-rut.page.scss'],
})
export class PostRutPage implements AfterViewInit {
  private map!: L.Map;
  public paradas: L.Marker[] = [];
  private coordenadasParadas: L.LatLng[] = [];
  private direcciones: string[] = [];

  ngAfterViewInit(): void {
    this.initMap();
    setTimeout(() => this.map.invalidateSize(), 200);
  }
  
  private initMap(): void {
    this.map = L.map('map').setView([7.1193, -73.1227], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    this.setupParadas();
  }

  private obtenerDireccion(latlng: L.LatLng, index: number): void {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.direcciones[index] = data.display_name; // Almacenar la dirección
        console.log(data.display_name); // Muestra la dirección obtenida
      })
      .catch(error => console.error('Error al obtener la dirección:', error));
  }
  

  private setupParadas(): void {
    this.map.on('click', (e) => {
      if (this.paradas.length < 4) {
        const parada = L.marker(e.latlng).addTo(this.map);
        this.paradas.push(parada);
        this.coordenadasParadas.push(e.latlng);
        this.obtenerDireccion(e.latlng, this.paradas.length - 1);

        // Opcionalmente, aquí puedes llamar a un método para actualizar un formulario o UI
      }
    });
    
  }
  public publicarRuta(): void {
    // Lógica para publicar la ruta
    console.log('Ruta publicada:', this.coordenadasParadas, this.direcciones);
    // Aquí iría el código para manejar la publicación de la ruta
  }
  
  private enviarParadas(): void {
    // Aquí puedes enviar las coordenadas al backend o manejarlas como necesites
    console.log(this.coordenadasParadas);
  }
}

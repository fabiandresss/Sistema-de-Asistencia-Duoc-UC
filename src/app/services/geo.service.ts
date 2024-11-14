import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { showAlertError } from '../tools/message-functions';

@Injectable({
  providedIn: 'root',
})
export class GeoService {

  private readonly apiUrl = 'https://nominatim.openstreetmap.org';

  constructor(private platform: Platform, private http: HttpClient) {}

  async getCurrentPosition(): Promise<{ lat: number; lng: number } | null> {
    try {
      if (this.platform.is('capacitor')) {
        const { coords } = await Geolocation.getCurrentPosition({ 
          enableHighAccuracy: true, 
          timeout: 10000, 
          maximumAge: 0 
        });
        return { lat: coords.latitude, lng: coords.longitude };

      } else if (this.platform.is('desktop') || this.platform.is('pwa')) {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            ({ coords }) => resolve({ 
                lat: coords.latitude, 
                lng: coords.longitude 
            }),
            (error) => {
              showAlertError('getCurrentPosition', error);
              reject(error);
            }
          );
        });
      }
      showAlertError('GeolocationService.getCurrentPosition',
          'Plataforma no soportada para obtener la posición');
      return null;
    } catch (error) {
      showAlertError('GeolocationService.getCurrentPosition', error);
      return null;
    }
  }


  getPlaceFromCoordinates(lat: number, lng: number): Observable<any> {
    try {
      const url = `${this.apiUrl}/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
      return this.http.get(url).pipe(
        catchError(error => {
          showAlertError('getPlaceFromCoordinates', error);
          return of(null); 
        })
      );
    } catch (error) {
      showAlertError('GeolocationService.getPlaceFromCoordinates', error);
      return of(null); 
    }
  }
  
}


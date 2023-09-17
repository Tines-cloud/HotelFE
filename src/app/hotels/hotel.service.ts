import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hotel } from './hotel';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  private baseURL:string="http://localhost:8080/";

  constructor(private httpClient:HttpClient) { 

  }

  getHotelList():Observable<Hotel[]>{
    return this.httpClient.get<Hotel[]>(`${this.baseURL}`+`hotels`);
  }

  createHotel(hotel:Hotel):Observable<object>{
    return this.httpClient.post(`${this.baseURL}`+`hotels`,hotel);
  }

  getHotelById(id:string):Observable<Hotel>{
    return this.httpClient.get<Hotel>(`${this.baseURL}`+`hotels/`+`${id}`);
  }

  updateHotel(id:string,hotel:Hotel):Observable<object>{
    return this.httpClient.put(`${this.baseURL}`+`hotels/${id}`,hotel);
  }
  deleteHotel(id:string):Observable<Hotel>{
    return this.httpClient.delete<Hotel>(`${this.baseURL}`+`hotels/`+`${id}`);
  }
}

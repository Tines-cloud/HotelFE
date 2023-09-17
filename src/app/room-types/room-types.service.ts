import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contract } from '../contracts/contract';
import { RoomType } from './room-types';

@Injectable({
  providedIn: 'root'
})
export class RoomTypesService {
  private baseURL:string="http://localhost:8080/";

  constructor(private httpClient:HttpClient) { }

  getContractList():Observable<Contract[]>{
    return this.httpClient.get<Contract[]>(`${this.baseURL}`+`contracts`);
  }
  getRoomTypeList():Observable<RoomType[]>{
    return this.httpClient.get<RoomType[]>(`${this.baseURL}`+`roomTypes`);
  }
  getRoomTypeById(id:string):Observable<RoomType>{
    return this.httpClient.get<RoomType>(`${this.baseURL}`+`roomTypes/`+`${id}`);
  }
  getRoomTypeByContractId(id:string):Observable<RoomType[]>{
    return this.httpClient.get<RoomType[]>(`${this.baseURL}`+`contracts/${id}/roomTypes`);
  }
  createRoomType(id:string,roomType:RoomType):Observable<object>{
    return this.httpClient.post(`${this.baseURL}`+`contracts/${id}/roomTypes`,roomType);
  }
  updateRoomType(id:string,roomType:RoomType):Observable<object>{
    return this.httpClient.put(`${this.baseURL}`+`contracts/${id}/roomTypes`,roomType);
  }
  deleteRoomType(id:string):Observable<RoomType>{
    return this.httpClient.delete<RoomType>(`${this.baseURL}`+`roomTypes/`+`${id}`);
  }
}

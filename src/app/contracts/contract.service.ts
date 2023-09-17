import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Contract } from './contract';
import { Observable } from 'rxjs';
import { Hotel } from '../hotels/hotel';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  private baseURL:string="http://localhost:8080/";

  constructor(private httpClient:HttpClient) { }
  getHotelList():Observable<Hotel[]>{
    return this.httpClient.get<Hotel[]>(`${this.baseURL}`+`hotels`);
  }
  getContractList():Observable<Contract[]>{
    return this.httpClient.get<Contract[]>(`${this.baseURL}`+`contracts`);
  }
  getContractById(id:string):Observable<Contract>{
    return this.httpClient.get<Contract>(`${this.baseURL}`+`contracts/`+`${id}`);
  }
  getContractByHotelId(id:string):Observable<Contract[]>{
    return this.httpClient.get<Contract[]>(`${this.baseURL}`+`hotels/${id}/contracts`);
  }

  createContract(id:string,contract:Contract):Observable<object>{
    return this.httpClient.post(`${this.baseURL}`+`hotels/${id}/contracts`,contract);
  }
  updateContract(id:string,contract:Contract):Observable<object>{
    return this.httpClient.put(`${this.baseURL}`+`hotels/${id}/contracts`,contract);
  }
  deleteContract(id:string):Observable<Contract>{
    return this.httpClient.delete<Contract>(`${this.baseURL}`+`contracts/`+`${id}`);
  }

/* ngb datepicker date format convert to string */
  convertNgbDateToString(date: NgbDateStruct) {
    return date?date.year+"-"+('0'+date.month).slice(-2)
           +"-"+('0'+date.day).slice(-2):null
 }
}
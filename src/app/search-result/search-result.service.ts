import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchResult } from './search-result';

@Injectable({
  providedIn: 'root'
})
export class SearchResultService {

  private baseURL:string="http://localhost:8080/";

  constructor(private httpClient:HttpClient) { }

  getResult(date:string,noOfDays:any,roomCount:any,adultCount:any):Observable<SearchResult[]>{
    return this.httpClient.get<SearchResult[]>(`${this.baseURL}`+`resultFinal/${date}/${noOfDays}/${roomCount}/${adultCount}`);
  }
}
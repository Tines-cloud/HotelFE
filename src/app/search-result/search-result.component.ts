import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchResult } from './search-result';
import { SearchResultService } from './search-result.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
  searchResults: SearchResult[];
  date:any;
  noOfDays:any;
  roomCount:any;
  adultCount:any;

  isEmpty:boolean=false;
  
  constructor(private searchResultServices:SearchResultService,
    private route:ActivatedRoute) { 

     }
  ngOnInit(): void {
    this.date=this.route.snapshot.queryParamMap.get('date');
    this.noOfDays=this.route.snapshot.queryParamMap.get('noOfDays');
    this.roomCount=this.route.snapshot.queryParamMap.get('roomCount');
    this.adultCount=this.route.snapshot.queryParamMap.get('adultCount');

    this.getResult();
  }
  private getResult(){
    this.searchResultServices.getResult(this.date,this.noOfDays,this.roomCount,this.adultCount).subscribe( data=> {
      this.searchResults=data;
      if(data.length>0){
        this.isEmpty=true;
      }
     }
    );
  }
}

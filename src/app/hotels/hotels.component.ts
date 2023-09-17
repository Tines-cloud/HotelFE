import { Component, OnInit } from '@angular/core';
import { Hotel } from './hotel';
import { HotelService } from './hotel.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contract } from '../contracts/contract';
import { ContractService } from '../contracts/contract.service';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css']
})
export class HotelsComponent implements OnInit {
  modalForm : FormGroup;
  page:number=1;
  pageSize:number=6;
  closeResult:string;
  hotels: Hotel[];
  contracts:Contract [];
  hotel:Hotel = new Hotel();
  isPresent:boolean=false;

  searchText:any = "";

  constructor(private hotelServices:HotelService,
    private contractService:ContractService,
    private modalService:NgbModal, 
    private router:Router, 
    private route:ActivatedRoute,private fb:FormBuilder
    ) { 

      this.modalForm = fb.group({
        'hotelId' : [null, Validators.required],
        'hotelName' : [null, Validators.required],
        'location' : [null, Validators.required]
      })

  }

  get f(){
    return this.modalForm.controls;
  }

  ngOnInit(): void {
    this.getHotels();
  }

  private getHotels(){
    this.hotelServices.getHotelList().subscribe( data=> {
      this.hotels=data;
     }
    );
  }

  private saveHotel(){
    this.hotelServices.createHotel(this.hotel).subscribe(data=>{
      this.refreshPage();
    },
    error=>console.log(error));

  }

  private updateHotel(id:string){
    this.hotelServices.updateHotel(id,this.hotel).subscribe(data=>{
      this.refreshPage();
    },
    error=>console.log(error));
  }

  private deleteHotel(id:string,content:any){
    this.hotelServices.deleteHotel(id).subscribe(data=>{
      this.refreshPage();
    },
    error=>this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    }));
    this.modalService.dismissAll();
  }

  private refreshPage(){
    this.modalService.dismissAll();
    window.location.reload();
    /*
    this.modalService.dismissAll();
      this.router.routeReuseStrategy.shouldReuseRoute=()=>false;
      this.router.onSameUrlNavigation='reload';
      this.router.navigate(['./'],{
        relativeTo:this.route
      })
      */
  }

  open(content:any) {
    this.modalForm.reset();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  view(content:any,id:string) {
    this.hotelServices.getHotelById(id).subscribe(data=>{this.hotel=data});
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  confirmDelete(content:any,id:string) {
    this.contractService.getContractByHotelId(id).subscribe(data=> {
      this.contracts=data;});

    this.modalService.dismissAll();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onSubmit(content:any){
    this.hotel.id=this.modalForm.get('hotelId')?.value;
    this.hotel.name=this.modalForm.get('hotelName')?.value;
    this.hotel.location=this.modalForm.get('location')?.value;

    for(let i=0;i<this.hotels.length;i++){
      if(this.hotel.id==this.hotels[i].id){
        this.isPresent=true;
      }
    }
    
    if(this.isPresent){
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
    else{
      this.saveHotel();
    }
    
    this.isPresent=false;

  }

  onSubmitUpdates(id:string){
    this.updateHotel(id);
  }
  
  onDeleteSubmit(content:any,id:string){
   /* if(this.contracts.length>0){
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
    else{
      
    }
    */
    this.deleteHotel(id,content);
    
  }

  
  Search(){
    if(this.searchText!== ""){
      let searchValue = this.searchText.toLocaleLowerCase();
     
      this.hotels = this.hotels.filter((contact:any) =>{
        return contact.name.toLocaleLowerCase().match(searchValue );
      });
            
          }
          else { 
            this.hotelServices.getHotelList().subscribe( data=> {
    
              this.hotels = data;
           
                  }, error => console.error(error));
          } 
      }
}

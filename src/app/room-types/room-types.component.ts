import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Contract } from '../contracts/contract';
import { RoomType } from './room-types';
import { RoomTypesService } from './room-types.service';

@Component({
  selector: 'app-room-types',
  templateUrl: './room-types.component.html',
  styleUrls: ['./room-types.component.css']
})
export class RoomTypesComponent implements OnInit {

  modalForm : FormGroup;

  page:number=1;
  pageSize:number=6;
  closeResult:string;
  roomTypes: RoomType[];
  roomType:RoomType = new RoomType();

  contracts:Contract[];
  contractId:string;

  isPresent:boolean=false;

  room1:Number;
  room2:Number;

  searchText:any = "";

  constructor(private roomTypeServices:RoomTypesService,
    private modalService:NgbModal, 
    private router:Router, 
    private route:ActivatedRoute,
    private fb:FormBuilder
    ) { 
      this.modalForm = fb.group({
        'roomTypeId' : [null, Validators.required],
        'name' : [null, Validators.required],
        'maxAdult' : [null, [Validators.required,Validators.pattern("^[0-9]+(.[0-9]{0,2})?$"),Validators.min(1),Validators.max(3)]],
        'pricePerAdult' : [null, [Validators.required, Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")]],
        'totalRooms' : [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
        'reservedRooms' : [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
        'contractId' : [null, Validators.required]
      });

     }

get f(){
  return this.modalForm.controls;
}

  ngOnInit(): void {
    this.getRoomTypes();
  }
  private getRoomTypes(){
    this.roomTypeServices.getRoomTypeList().subscribe( data=> {
      this.roomTypes=data;
     }
    );
    this.roomTypeServices.getContractList().subscribe(data=>{this.contracts=data});
  }

  private saveRoomType(id:string){
    this.roomTypeServices.createRoomType(id,this.roomType).subscribe(data=>{console.log(data);
      this.refreshPage();
    },
    error=>console.log(error));

  }

  private updateRoomType(id:string){
    this.roomTypeServices.updateRoomType(id,this.roomType).subscribe(data=>{console.log(data);
      this.refreshPage();
    },
    error=>console.log(error));
  }

  private deleteRoomType(id:string){
    this.roomTypeServices.deleteRoomType(id).subscribe(data=>{console.log(data);
      this.refreshPage();
    },
    error=>console.log(error));
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
    this.roomTypeServices.getRoomTypeById(id).subscribe(data=>{this.roomType=data});
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  confirmDelete(content:any,id:string) {
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

  onSubmit(content1:any,content2:any){
    this.roomType.id=this.modalForm.get('roomTypeId')?.value;
    this.roomType.name=this.modalForm.get('name')?.value;
    this.roomType.maxAdult=this.modalForm.get('maxAdult')?.value;
    this.roomType.pricePerAdult=this.modalForm.get('pricePerAdult')?.value;
    this.roomType.totalRooms=this.modalForm.get('totalRooms')?.value;
    this.roomType.reservedRooms=this.modalForm.get('reservedRooms')?.value;
    this.contractId=this.modalForm.get('contractId')?.value;

    this.room1= new Number(Number.parseInt(this.modalForm.get('totalRooms')?.value));
    this.room2= new Number(Number.parseInt(this.modalForm.get('reservedRooms')?.value));

    for(let i=0;i<this.roomTypes.length;i++){
      if(this.roomType.id==this.roomTypes[i].id){
        this.isPresent=true;
      }
    }

    if(this.isPresent){
      this.modalService.open(content1, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
    else if(this.room1<this.room2){
      this.modalService.open(content2, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
    else{
      this.saveRoomType(this.contractId);
    }
    this.isPresent=false;
    this.room1=0;
    this.room2=0;

  }

  onSubmitUpdateRoomType(content:any){
    this.roomType.id=this.modalForm.get('roomTypeId')?.value;
    this.roomType.name=this.modalForm.get('name')?.value;
    this.roomType.maxAdult=this.modalForm.get('maxAdult')?.value;
    this.roomType.pricePerAdult=this.modalForm.get('pricePerAdult')?.value;
    this.roomType.totalRooms=this.modalForm.get('totalRooms')?.value;
    this.roomType.reservedRooms=this.modalForm.get('reservedRooms')?.value;
    this.contractId=this.modalForm.get('contractId')?.value;

    this.room1= new Number(Number.parseInt(this.modalForm.get('totalRooms')?.value));
    this.room2= new Number(Number.parseInt(this.modalForm.get('reservedRooms')?.value));

    if(this.room1<this.room2){
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
    else{
      this.updateRoomType(this.contractId);
    }
    this.room1=0;
    this.room2=0;
  }

  onDeleteSubmit(id:string){
    this.deleteRoomType(id);
  }

  Search(){
    if(this.searchText!== ""){
      let searchValue = this.searchText.toLocaleLowerCase();
     
      this.roomTypes = this.roomTypes.filter((contact:any) =>{
        return contact.name.toLocaleLowerCase().match(searchValue );});
            
            console.log(this.roomTypes);
          }
          else { 
            this.roomTypeServices.getRoomTypeList().subscribe( data=> {
    
              this.roomTypes = data;
           
                  }, error => console.error(error));
            
          } 
      }
  
}
import { AbstractType, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Hotel } from '../hotels/hotel';
import { RoomType } from '../room-types/room-types';
import { RoomTypesService } from '../room-types/room-types.service';
import { Contract } from './contract';
import { ContractService } from './contract.service';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css']
})
export class ContractsComponent implements OnInit {

  modalForm : FormGroup;

  page:number=1;
  pageSize:number=6;
  closeResult:string;
  contracts: Contract [];
  contract:Contract = new Contract();

  hotels:Hotel[];
  hotelId:string;

  fromDate:any;
  toDate:any;

  date1:Date;
  date2:Date;

  isPresent:boolean=false;
  roomTypes:RoomType[];

  searchText:any = "";

  constructor(private contractServices:ContractService,
    private roomTypeService:RoomTypesService,
    private modalService:NgbModal, 
    private router:Router, 
    private route:ActivatedRoute,
    private fb:FormBuilder
    ) {   
      
      this.modalForm = fb.group({
      'contractId' : [null, Validators.required],
      'fromDate' : [null, Validators.required],
      'toDate' : [null, Validators.required],
      'markup' : [null,  [Validators.required, Validators.pattern("^[0-9]+(.[0-9]{0,2})?$"),Validators.min(1),Validators.max(100)]],
      'hotelId' : [null, Validators.required]
    });

}

get f(){
  return this.modalForm.controls;
}

  ngOnInit(): void {
    this.getContracts();
  }
  private getContracts(){
    this.contractServices.getContractList().subscribe( data=> {
      this.contracts=data;
     }
    );
    this.contractServices.getHotelList().subscribe(data=>{this.hotels=data});
  }

  private saveContract(id:string){
    this.contractServices.createContract(id,this.contract).subscribe(data=>{
      this.refreshPage();
    },
    error=>console.log(error));

  }

  private updateContract(id:string){
    this.contractServices.updateContract(id,this.contract).subscribe(data=>{
      this.refreshPage();
    },
    error=>console.log(error));
  }

  private deleteContract(content:any, id:string){
    this.contractServices.deleteContract(id).subscribe(data=>{console.log(data);
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
    this.contractServices.getContractById(id).subscribe(data=>{this.contract=data});
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  confirmDelete(content:any,id:string) {
    this.roomTypeService.getRoomTypeByContractId(id).subscribe(data=> {
      this.roomTypes=data;
    });
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
    
    this.fromDate=this.modalForm.get('fromDate')?.value;
    this.toDate=this.modalForm.get('toDate')?.value;

   // this.fromDate=this.contractServices.convertNgbDateToString(this.modalForm.get('fromDate')?.value);
   // this.toDate=this.contractServices.convertNgbDateToString(this.modalForm.get('toDate')?.value);

    this.date1=new Date(Date.parse(this.fromDate));
    this.date2=new Date(Date.parse(this.toDate));

    this.contract.id=this.modalForm.get('contractId')?.value;
    this.contract.fromDate= this.fromDate;
    this.contract.toDate=this.toDate;
    this.contract.markup=this.modalForm.get('markup')?.value;
    this.hotelId=this.modalForm.get('hotelId')?.value;

    for(let i=0;i<this.contracts.length;i++){
      if(this.contract.id==this.contracts[i].id){
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
    else if(this.date1>this.date2){
      this.modalService.open(content2, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
    else{
      this.saveContract(this.hotelId);
    }
    
    this.isPresent=false;

  }

  onSubmitUpdateContract(content:any){

    this.fromDate=this.contract.fromDate;
    this.toDate=this.contract.toDate;

    this.date1=new Date(Date.parse(this.fromDate));
    this.date2=new Date(Date.parse(this.toDate));

    this.contract.fromDate= this.fromDate;
    this.contract.toDate=this.toDate;
    this.contract.markup=this.modalForm.get('markup')?.value;
    this.hotelId=this.modalForm.get('hotelId')?.value;

    if(this.date1>this.date2){
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
    else{
      this.updateContract(this.hotelId);
    }
   
  }

  onDeleteSubmit(content:any, id:string){
    this.deleteContract(content,id);
  }

  Search(){
    if(this.searchText!== ""){
      let searchValue = this.searchText.toLocaleLowerCase();
     
      this.contracts = this.contracts.filter((contact:any) =>{
        return contact.id.toLocaleLowerCase().match(searchValue );
      });
            
          }
          else { 
            this.contractServices.getContractList().subscribe( data=> {
    
              this.contracts = data;
           
                  }, error => console.error(error));
          } 
      }

}
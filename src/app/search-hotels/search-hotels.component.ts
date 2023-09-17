import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { findIndex } from 'rxjs';
import { __param } from 'tslib';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-search-hotels',
  templateUrl: './search-hotels.component.html',
  styleUrls: ['./search-hotels.component.css']
})
export class SearchHotelsComponent implements OnInit {

  public form: FormGroup;
  public roomList: FormArray;

  checkInDate:any;
  noOfNights:any;
  roomArray:any[];
  noOfRooms:any;
  noAdults:number=0;
  date:string;

  counter(i: number) {
    return new Array(i);
  }

  get roomFormGroup() {
    return this.form.get('room') as FormArray;
  }

  constructor(private fb: FormBuilder, private router:Router,route:ActivatedRoute
    ) {}

  ngOnInit() {
    this.form = this.fb.group({
      checkInDate: [null, Validators.required],
      noOfNights: [null, Validators.required],
      room: this.fb.array([this.createRoom()], Validators.required)
    });
    this.roomList = this.form.get('room') as FormArray;
  }
  
  get f(){
    return this.form.controls;
  }

  createRoom(): FormGroup {
    return this.fb.group({
      countOfAdult: [null, Validators.required]
    });
  }

  addRoom() {
    this.roomList.push(this.createRoom());
  }

  removeRoom(index:any) {
    this.roomList.removeAt(index);
  }

  getRoomFormGroup(index:any): FormGroup {
    const formGroup = this.roomList.controls[index] as FormGroup;
    return formGroup;
  }

  
  private dateToString = (date:any) => `${date.year}-${date.month}-${date.day}`; 

  getValues(){
    this.checkInDate=this.form.get('checkInDate')?.value;
    this.date=this.dateToString(this.checkInDate);
    this.noOfNights=this.form.get('noOfNights')?.value;
    this.roomArray=this.form.get('room')?.value;
    this.noOfRooms=this.roomArray.length;

    for (let i = 0; i < this.noOfRooms ; i++) {      
      this.noAdults=this.noAdults+parseInt(this.getRoomFormGroup(i).controls['countOfAdult'].value);
    }
    
    this.router.navigate(['results'],{queryParams:{date:this.date,noOfDays:this.noOfNights,roomCount:this.noOfRooms,adultCount:this.noAdults}});
  }

  clearValues(){
    this.checkInDate="";
    this.date="";
    this.noOfNights="";
    this.noOfRooms="";
    this.noAdults=0;
  }

  submit() {
    this.getValues();
    this.clearValues();

  }
}

import { Contract } from "../contracts/contract";

export class RoomType {
    id:string;
    name:string;
    pricePerAdult:number;
    maxAdult:number;
    totalRooms:number;
    reservedRooms:number;
    contract:Contract;
}

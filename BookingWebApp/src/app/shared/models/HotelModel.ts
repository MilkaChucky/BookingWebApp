import { RoomModel } from './RoomModel';

export interface HotelModel {
    _id: string;
    name: string;
    address: string;
    rooms: RoomModel[];
}
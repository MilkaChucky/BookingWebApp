import { RoomModel } from './RoomModel';

export interface HotelModel {
    _id: string;
    name: string;
    address: string;
    images?: string;
    rooms: RoomModel[];
}
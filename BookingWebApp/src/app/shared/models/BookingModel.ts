import { RoomModel } from './RoomModel'

export interface BookingModel {
    _id: string;
    user: string;       // user _id
    hotel: string;      // hotel _id
    rating: number;     // element of [0, 5], 0 default
    opinion: string;
    rooms: RoomBookingModel[];
}

export interface RoomBookingModel {
    _id?: string;
    roomId: string;     // room _id
    from: Date;
    until: Date;
}

export interface BookingDto {
    _id: string;
    hotel: {_id: string, name: string, address: string};
    bookedRooms: RoomBookingDto[];
}

export interface RoomBookingDto {
    _id: string;
    from: Date | string;
    until: Date | string;
    roomId: string;
    room: RoomModel;
}

export interface AddBookingDto {
    rooms: RoomBookingModel[];
}
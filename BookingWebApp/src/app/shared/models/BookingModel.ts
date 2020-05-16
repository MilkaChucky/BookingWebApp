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

export interface AddBookingDto {
    rooms: RoomBookingModel[];
};
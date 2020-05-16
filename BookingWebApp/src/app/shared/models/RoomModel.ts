export interface RoomModel {
    _id: string;
    number: number;
    beds: number;
    price: number;
    free: boolean; // TODO: törölni
    images?: string[];
}

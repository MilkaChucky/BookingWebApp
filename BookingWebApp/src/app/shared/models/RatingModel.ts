export interface RatingModel {
    rating?: number;
    opinion?: string;
    email?: string;
}

export interface RatingsDto {
    average: number;
    ratings: RatingModel[];
}

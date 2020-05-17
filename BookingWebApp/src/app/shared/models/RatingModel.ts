export interface RatingModel {
    rating?: number;
    opinion?: string;
}

export interface RatingsDto {
    average: number;
    ratings: RatingModel[];
}
export declare class CreateSessionDto {
    day: string;
    time: string;
    room: string;
    price: number;
    totalSeats?: number;
    movieId: string;
    cinemaId?: string;
}
declare const UpdateSessionDto_base: import("@nestjs/common").Type<Partial<CreateSessionDto>>;
export declare class UpdateSessionDto extends UpdateSessionDto_base {
}
export {};

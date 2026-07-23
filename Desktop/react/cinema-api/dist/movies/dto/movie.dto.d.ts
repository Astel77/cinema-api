export declare class CreateMovieDto {
    title: string;
    genre: string;
    description?: string;
    image: string;
    durationMinutes?: number;
    isNew?: boolean;
}
declare const UpdateMovieDto_base: import("@nestjs/common").Type<Partial<CreateMovieDto>>;
export declare class UpdateMovieDto extends UpdateMovieDto_base {
}
export {};

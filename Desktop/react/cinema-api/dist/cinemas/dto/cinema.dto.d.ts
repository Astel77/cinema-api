export declare class CreateCinemaDto {
    name: string;
    address: string;
    rooms: number;
}
declare const UpdateCinemaDto_base: import("@nestjs/common").Type<Partial<CreateCinemaDto>>;
export declare class UpdateCinemaDto extends UpdateCinemaDto_base {
}
export {};

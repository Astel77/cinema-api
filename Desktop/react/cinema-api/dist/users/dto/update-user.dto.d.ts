import { Role } from '../../common/enums/role.enum';
export declare class UpdateUserDto {
    fullName?: string;
    email?: string;
    password?: string;
}
export declare class UpdateUserRoleDto {
    role: Role;
}
export declare class UpdateUserStatusDto {
    isActive: boolean;
}

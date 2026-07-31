import { MembershipRole } from "@/modules/workspace/workspace.types";
import { IsEnum, IsString } from "class-validator";

export class AddMemberDto {
    @IsString()
    @IsEnum(MembershipRole)
    role: MembershipRole;

    @IsString()
    memberId: string;
}
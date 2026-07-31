import { IsString } from 'class-validator';

import { PaginationQueryDto } from '@/modules/common/dto/pagination-query.dto';

export class ListProjectsDto extends PaginationQueryDto {
  @IsString()
  workspaceId: string;
}

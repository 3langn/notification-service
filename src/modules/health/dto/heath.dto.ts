import { ApiProperty } from "@nestjs/swagger";

export class HealtchCheckResponseDto {
  @ApiProperty({
    example: "Notification Service",
  })
  api: string;

  @ApiProperty({
    example: "1.0",
  })
  version: string;

  @ApiProperty({
    example: "OK",
  })
  status: string;

  @ApiProperty({
    example: "2021-01-01T00:00:00.000Z",
  })
  timestamp: string;
}

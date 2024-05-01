import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches } from "class-validator";

export class WalletDto {
  @ApiProperty({
    example: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    description: "Ethereum wallet address",
  })
  @IsString()
  @Matches(/^0x[a-fA-F0-9]{40}$/, {
    message: "Invalid Ethereum wallet address format",
  })
  address: string;

  @ApiProperty({
    example: "0x123...abc",
    description: "Signature from the wallet",
  })
  @IsString()
  signature: string;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Exclude } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

@Entity("users")
export class User {
  @ApiProperty({
    description: "The unique identifier of the user",
    example: 1,
  })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({
    description: "The email of the user",
    example: "user@example.com",
  })
  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @Exclude()
  password: string;

  @ApiProperty({
    description: "The refresh token used for authentication",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    nullable: true,
  })
  @Column({ nullable: true })
  @Exclude()
  refreshToken?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: "json", nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true })
  walletAddress: string;

  @Column({ nullable: true })
  passwordResetToken: string;

  @Column({ nullable: true })
  passwordResetExpires: Date;

  @ApiProperty({
    description: "The date when the user was created",
    example: "2024-03-16T20:00:00.000Z",
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: "The date when the user was last updated",
    example: "2024-03-16T20:00:00.000Z",
  })
  @UpdateDateColumn()
  updatedAt: Date;
}

import { Column, Entity, PrimaryColumn } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity("user")
export class UserEntity extends BaseEntity {
  @PrimaryColumn("text")
  userName: string;

  @Column("text")
  passwordHash: string;
}

import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { ItemEntity } from "./item.entity";

@Entity("user")
export class UserEntity extends BaseEntity {
  @PrimaryColumn("text")
  userName: string;

  @Column("text")
  passwordHash: string;

  @OneToMany(() => ItemEntity, (item) => item.user)
  items: ItemEntity[];
}

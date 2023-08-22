import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity("toDoItem")
export class ItemEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  content: string;
}

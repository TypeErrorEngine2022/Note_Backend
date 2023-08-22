import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity("toDoItem")
export class ItemEntity extends BaseEntity {
  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "varchar" })
  content: string;
}

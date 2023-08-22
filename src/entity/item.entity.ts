import { Column, Entity, UpdateDateColumn } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity("toDoItem")
export class ItemEntity extends BaseEntity {
  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "varchar" })
  content: string;

  @UpdateDateColumn({ type: "timestamptz", nullable: true })
  lastModificationTime: Date;

  @Column({ type: "boolean", default: false })
  isDeleted: boolean;
}

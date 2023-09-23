import { Column, Entity, ManyToOne, UpdateDateColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { UserEntity } from "./User.entity";

@Entity("toDoItem")
export class ItemEntity extends BaseEntity {
  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "varchar" })
  content: string;

  @Column({ type: "boolean", default: false })
  isCompleted: boolean;

  @UpdateDateColumn({ type: "timestamptz", nullable: true })
  lastModificationTime: Date;

  @Column({ type: "boolean", default: false })
  isDeleted: boolean;

  @ManyToOne(() => UserEntity, (user) => user.items)
  user: UserEntity;
}

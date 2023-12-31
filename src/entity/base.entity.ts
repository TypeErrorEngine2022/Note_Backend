import { CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";

export class BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string = uuidv4();

  @CreateDateColumn()
  creationTime: Date = new Date();
}

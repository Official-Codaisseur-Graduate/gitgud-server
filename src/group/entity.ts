import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  JoinTable,
  ManyToMany,
  Unique
} from "typeorm";
import {Score} from '../score/entity'

@Entity()
@Unique(["groupName"])
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  groupName: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => Score)
  @JoinTable()
  scores: Score[];
}

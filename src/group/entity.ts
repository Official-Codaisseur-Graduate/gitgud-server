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
import { MinLength, MaxLength } from "class-validator";
import { Score } from '../score/entity'

@Entity()
@Unique(["groupName"])
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @MinLength(4)
  @MaxLength(20)
  groupName: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => Score)
  @JoinTable()
  scores: Score[];
}

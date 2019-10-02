import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  JoinTable,
  ManyToMany
} from "typeorm";
import {Score} from '../score/entity'

@Entity()
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

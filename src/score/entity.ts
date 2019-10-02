import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
} from "typeorm";
// import { Group } from "../group/entity";

@Entity()
export class Score extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column()
  profileScore: number;

  @Column({ default: 0 })
  gitScore: number;

  // @ManyToOne(() => Group, group => group.scores)
  // group: Group;

  @CreateDateColumn()
  createdAt: Date;
}

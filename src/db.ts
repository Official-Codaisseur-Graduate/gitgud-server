import { createConnection } from "typeorm";
import { Score } from "./score/entity";
import { Group } from "./group/entity"

export default () => {
  return createConnection({
    type: "postgres",
    url:
      process.env.DATABASE_URL ||
      "postgres://postgres:secret@localhost:5430/postgres",
    entities: [Score, Group],
    synchronize: true
  }).then(_ => console.log("Connected to Postgres with TypeORM"));
};

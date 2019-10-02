import { analyzeProfile } from "./profileScore";
import { fetchGeneralData } from './gitUse'
import { Group } from "../group/entity";

const data = await analyzeProfile(username);
const gitUse = await fetchGeneralData(username);

users = Score.find({group})

data.stats = gitUse;
let averageRepoScore = 0;
let lastScore;
const userScores = await Score.find({ userName: username });

if (userScores.length > 0) {
  data.previousScores = userScores;
  lastScore = userScores[userScores.length - 1];
} else {
  lastScore = null;
}

const score = new Score();
score.profileScore = data.score;
score.gitScore = 0;
score.userName = username;
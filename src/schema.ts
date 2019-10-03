import { makeExecutableSchema } from "graphql-tools";
import { getRepository } from "typeorm";
import { fetchRepoData } from "./data/repoDetails";
import { analyzeProfile } from "./data/profileScore";
import { fetchGeneralData } from "./data/gitUse";
import { Score } from "./score/entity";
import { Group } from './group/entity'
const typeDefs = require("./gqlQuery").default;

const resolvers = {
  Query: {
    user: async (_, { username }, __, ___) => {
      const data = await analyzeProfile(username);
      const gitUse = await fetchGeneralData(username);
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

      if (data.stats.totalPinnedRepos > 0) {
        const promises = data.stats.repoNames.map(async (repo, i) => {
          const TEST = await fetchRepoData(repo.owner, repo.name).then(
            repoData => {
              if (!repoData) throw new Error();
              averageRepoScore += repoData.totalRepoScore;
              data.stats.repoNames[i] = {
                ...data.stats.repoNames[i],
                commitScore: { ...repoData.commitScore },
                branchScore: { ...repoData.branchScore },
                description: repoData.description,
                gitIgnoreScore: repoData.gitIgnoreScore,
                repoReadMe: repoData.repoReadMe,
                totalRepoScore: repoData.totalRepoScore,
                descriptionDetails: repoData.descriptionDetails,
                nodeModules: repoData.nodeModules
              };
            }
          );
          return TEST;
        });

        return Promise.all(promises).then(() => {
          data.profileScore = data.score;
          data.averageRepoScore = Math.round(
            averageRepoScore / data.stats.repoNames.length
          );
          data.repoScore = Math.round(data.averageRepoScore / 2);
          data.score += data.repoScore;
          data.score = Math.round(data.score);
          score.gitScore = data.repoScore;
          saveScoreIfUpdated(score, lastScore);
          return data;
        });
      }

      saveScoreIfUpdated(score, lastScore);
      data.profileScore = data.score;
      data.repoScore = 0;
      return data;
    },
    repository: async (_, args, __, ___) => {
      const data = await fetchRepoData(args.owner, args.name);
      return data;
    },
    group: async (_, { groupName }, __, ___) => {
      const groupAndScores: any = await getRepository(Group)
        .createQueryBuilder("group")
        .where("group.groupName = :groupName",  { groupName: groupName })
        .leftJoinAndSelect("group.scores", "score")
        .getOne()

      console.log('group anf scores:', groupAndScores)

      const userNames = groupAndScores.scores.map(score => {
        const name = score.userName
        console.log('name', name)
        return name
      }).reduce((namesArr, name) => {
        if (namesArr.includes(name) === false) namesArr.push(name)
        return namesArr
      }, [])

      // console.log('arrayOfNames:', userNames)

      const profilesPromises = userNames.map(async username => {
        const profile = await analyzeProfile(username)
        // console.log('profile:', profile)
        return profile
      })
      const profiles = await Promise.all(profilesPromises) //.then().catch(console.error)
      console.log('profiles', profiles)
      const profilesResponse = profiles.map((profile: any) => {
        console.log('typeof:', typeof profile.score)

        const nameAndScore = {
          userName: profile.username,
          score: profile.score
        }
        return nameAndScore
      })

      console.log('profile responses:', profilesResponse)

      return {
        groupName: groupAndScores.groupName,
        profiles: profilesResponse
      }
        

      const generalDataPromises = userNames.map(async username => {
        const data = await fetchGeneralData(username)
        // console.log('generaldata:', data)
        return data
      })
      const generalData = await Promise.all(generalDataPromises)
      console.log('general data', generalData)
      return groupAndScores
    }
  },
  Mutation: {
    createGroup: async (_, { groupName }, __, ___) => {
      const group = await new Group()
      group.groupName = groupName
      getRepository(Group).save(group)
      return group
    },
    addUserToGroup: async (_, args, __, ___) => {
      const { groupName, username } = args
      const group = await getRepository(Group).find({ groupName: groupName })
      const scores = await getRepository(Score).find({ userName: username })
      group[0].scores = scores
      await getRepository(Group).save(group)
      return group[0]
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const saveScoreIfUpdated = (score, lastScore) => {
  if (!lastScore) {
    getRepository(Score).save(score);
  } else {
    const newScore = score.gitScore + score.profileScore;
    const oldScoreValue = lastScore.gitScore + lastScore.profileScore;
    if (
      new Date().toLocaleDateString() ===
      lastScore.createdAt.toLocaleDateString() &&
      newScore === oldScoreValue
    ) {
      return;
    }
    getRepository(Score).save(score);
  }
};

export default schema;

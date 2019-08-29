import { createApolloFetch } from "apollo-fetch";
import { commitValidation } from "../validation/repository/commits";
import { branchValidation } from "../validation/repository/branches";
import { scoreCalculator } from "../validation/repository/scoreCalculator";
import { fileValidation } from "../validation/repository/gitignore";


const token = process.env.GITHUB_ACCESS_TOKEN;

export const fetchRepoData = (username, repoName) => {
  const fetch = createApolloFetch({
    uri: "https://api.github.com/graphql"
  });

  fetch.use(({ options }, next) => {
    if (!options.headers) {
      options.headers = {};
    }
    options.headers["Authorization"] = `bearer ${token}`;
    next();
  });

  return fetch({
    query: `{
      repository(owner: "${username}", name: "${repoName}") {
        createdAt
        name
        description
        object(expression: "master:") {
        ... on Tree {
            entries {
              name
              oid
              object{
                ... on Blob{
                  text
                }
              }
            }
          }
        }

        refs(refPrefix: "refs/heads/", first: 50) {
          totalCount
          edges {
            node {
              branchName: name
              target {
                ... on Commit {
                  history(first: 50) {
                    totalCount
                    edges {
                      node {
                        ... on Commit {
                          message
                            author{
                              name
                            
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `
  }).then(res => {
    const name = res.data.repository.name
    const createdAt = res.data.repository.createdAt
    const entries = res.data.repository.object.entries

    const repoDescription = res.data.repository.description
      ? res.data.repository.description
      : "";
    const branchCount = res.data.repository.refs.totalCount;
    const branchNamePlusCommitCount = res.data.repository.refs.edges.map(
      branch => {
        const branchName = branch.node.branchName;
        const commitCount = branch.node.target.history.totalCount;
        return { branchName, commitCount };
      }
    );

    const fileCheck = res.data.repository.object.entries;
    const commitMessages = res.data.repository.refs.edges.map(branch => {
      return branch.node.target.history.edges.map(commit => {
        const messages = commit.node.message;
        return messages;
      });
    });

    const commitScore = commitValidation(commitMessages);

    const branchScore = branchValidation(
      branchCount,
      branchNamePlusCommitCount
    );

    const { gitIgnoreScore, repoReadMe } = fileValidation(fileCheck);


    const dependenciesExistInDescription = () => {
      const pkg_Json = res.data.repository.object.entries.find((en) =>
        en.name === 'package.json')
      if (pkg_Json) {
        let index_Start = pkg_Json.object.text.search('dependencies')
        const firstSlice = pkg_Json.object.text.slice(index_Start)
        index_Start = firstSlice.indexOf('{') + 1
        let index_Last = firstSlice.indexOf('}')
        const dependencies = firstSlice.slice(index_Start, index_Last).split(',')
        return dependencies.map((d) =>
          d.split(':')[0])
          .map(x => x.split('"')[1])
          .some(y => {
            if (repoDescription && repoDescription.toLowerCase().includes(y))
              return true
          })
      }
    }
    const calculateDescriptionScore = () => {
      let score = 100
      if (!repoDescription) {
        score -= 100
        return score
      }
      if (!dependenciesExistInDescription())
        score -= 40
      if (repoDescription.length > 165 || repoDescription.length < 10)
        score -= 40
      return score
    }
    const descriptionScore = calculateDescriptionScore()

    const totalRepoScore = Math.round(scoreCalculator(
      commitScore,
      branchScore,
      descriptionScore,
      repoReadMe,
      gitIgnoreScore
    ));

    return {
      commitScore,
      branchScore,
      totalRepoScore,
      repoReadMe,
      gitIgnoreScore,
      description: descriptionScore,
      name,
      createdAt,
      entries
    };
  })
    .catch(e => e)
};


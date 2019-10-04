const typeDefs = `
  type Query {
    user(username: String): User
    repository(owner: String, name: String): Repository
    group(groupName: String): ProfileOnlyScore
  }

  type Mutation {
    createGroup(groupName: String): Group
    addUserToGroup(groupName: String, username: String): Group
  }

  type User {
    username: String
    score: Int
    profileScore: Int
    averageRepoScore: Int
    repoScore: Int
    profileStats: Profile
    stats: Stats
    previousScores: [History]
  }

  type History {
    id: Int
    userName: String
    profileScore: Int
    gitScore: Int
    createdAt: String
  }

  type Profile {
    bio: Boolean
    email: Boolean
    isHireable: Boolean
    location: Boolean
    name: Boolean
    websiteUrl: Boolean
    pinnedRepositories: Boolean
    picture: Boolean
  }

  type Stats {
    totalPinnedRepos: Int
    averageBranchPerRepo: Int
    averageCommitPerBranch: Int
    repoNames: [Repository]
  }

  type Repository {
    name: String
    owner: String
    commitScore: Commit
    branchScore: Branch
    totalRepoScore: Int
    repoReadMe: Int
    gitIgnoreScore: Int
    description: Int
    descriptionDetails: DescriptionDetails
    nodeModules: Boolean
  }

  type DescriptionDetails {
    tooLong: Boolean
    tooShort: Boolean
    includesDependencies: Boolean
    exists: Boolean
  }

  type Commit {
    lengthExceeds: Int
    containsAND: Int
    containsPeriod: Int
    upperCase: Int
    commitCount: Int
    totalScore: Int
  }

  type Branch {
    hasThreeBranches: Int
    hasMasterBranch: Int
    hasDevelopmentBranch: Int
    hasFeatBranch: Int
    useDescriptiveNames: Int
    totalScore: Int
    branchCount: Int
    properNamesCount: Int
  }

  type Group {
    groupName: String
    scores: [Score]
  }

  type Score {
    userName: String
    profileScore: Int
    reposScore: Int
  }

  type ProfileOnlyScore {
    groupName: String
    profiles: [Score]
  }
`;
export default typeDefs;

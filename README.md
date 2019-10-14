# gitgud-server

A validator of your GitHub profile and Git use, designed to provide feedback for job seekers and graduated students.
You can find the repository for the client side [here](https://github.com/Official-Codaisseur-Graduate/gitgud-client).

## Table of contents:

- **[How](#how)**
- **[Why](#why)**
- **[Who](#who)**
- **[Technologies](#technologies)**
- **[Running the app locally](#running-the-app-locally)**
- **[Deployment server to Heroku](#deployment-server-to-heroku)**

## How

1. It checks your public profile - A good GitHub profile can impress an interviewer.
2. It validates your pinned repositories on how you use Git - Proper use of version control with Git can show that you are a structured worker and are able to work in development teams. We chose to focus on your pinned repos because you can present certain project as your portfolio for potential employers
3. It is possible to go to individual repositories and look at their ratings, this can be done by typing github-name/repo-name in the form.
4. It is also possible to search for multiple public profiles by typing the usernames separated by a space and clicking Go! When the results are in you can create a group with the users and their scores.
5. It supports searching for previously created groups.
6. It supports markdown files which include guidelines on how to build and polish your GitHub profile and repositories.

## Why

- You can use GitHub as your resume for job hunting. For developers it is important to code regularly, be able to work in teams, communicate properly and continue with a learning curve. Obviously this is something you can say you are the best in and write it on your resume, but with GitHub you are able to show that you can do this. Which will give you heads-up on your next interview.
- Unfortunately many recent graduates or job seekers lack a proper GitHub profile. And as Codaisseur teachers can acknowledge, the feedback they get is repetitive. Therefore we developed this tool and provide constructive feedback which is based on various resources across the internet and uses live data from the GitHub API.

## Who

- **Oleksandra Akulshyna** - _Initial work_ - [w3bgir1](https://github.com/w3bgir1)
- **Vincent de Graaf** - _Initial work_ - [vdegraaf](https://github.com/vdegraaf)
- **Natalia Volchatova** - _Initial work_ - [Klackky](https://github.com/Klackky)
- **Demmy Honore de Vries** [demmyhonore](https://github.com/demmyhonore)
- **Mario Nezmah** - _Repository page_ - [mnezmah](https://github.com/mnezmah)
- **Jelle Monen** [jelle89](https://github.com/jelle89)
- **Duc Trinh** [Ducatrinh](https://github.com/ducatrinh)
- **Shawn Wu** [Mqspx800](https://github.com/Mqspx800)
- **Halyna Burdiian** [Verdie](https://github.com/verdie)
- **Subash Pradhan** [SubashPradhan](https://github.com/SubashPradhan)
- **Olga Lokoshchenko** [loklock](https://github.com/loklock)
- **Andreea Cucos** [andreeaccss](https://github.com/AndreeaCcss)

## Technologies

- TypeScript, TypeORM, GraphQL, Apollo/KoaServer, Face-api.js
- GitHub API v4 - GraphQL

## Next steps for the students continuing this project

- Improve naming in the server directory (files, functions and variables), so structure is more understandable
- Schema.ts file can be splitted into two files, one only defining type and other with resolver
- Extra feature: Feedback on the commit usage of individuals when there is multiple contributors on the project
- Adjust scores for repositories depending on proper use of .gitignore file and README

## Running the app locally

- Server needs to be launched with GitHub token to enable GitHub API requests. <br> > [See instructions to create GitHub token here](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line). (!don't forget to check user scopes!)
- File client/src/index.js contains the server url. If you want to run local server, change it to your localhost.
- Setup a local postgresql database (username: postgres, password:secret)
- In the terminal, run
```
> git clone git@github.com:Official-Codaisseur-Graduate/gitgud-server.git
> cd gitgud-server
> npm install
> GITHUB_ACCESS_TOKEN=<YOURTOKEN> npm run dev
```

## Deployment server to Heroku

```
> git remote add heroku https://git.heroku.com/gitgud-server.git
> git push heroku master
```

## Acknowledgments

Special thanks to Rein op 't Land, our teacher and Product Owner.

- **Rein op 't Land** - [ReinoptLand](https://github.com/Reinoptland)

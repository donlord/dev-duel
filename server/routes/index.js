import { Router } from 'express'
import axios from 'axios'
import validate from 'express-validation'
import token from '../../token'

import validation from './validation'
import { create } from 'domain'

// counts the number of stars all of a user's repos
const sg = repo => {
  let sgcount = 0
  for (let obj of repo) {
    sgcount += obj['stargazers_count']
  }
  return sgcount
}
// param: repo and returns max star count
const highestStars = repo => {
  let hscount = 0
  for (let obj of repo) {
    if (obj['stargazers_count'] > hscount) {
      hscount = obj['stargazers_count']
    }
  }
  return hscount
}

// param: repo and returns num of repos w/ 0 issues
const perfRepos = repo => {
  let prcount = 0
  for (let obj of repo) {
    if (obj['open_issues_count'] === 0) {
      prcount += 1
    }
  }
  return prcount
}
// param: repo and returns language used most
const favLang = repo => {
  let dict = {}
  let lang = ''
  for (let obj of repo) {
    if (dict.hasOwnProperty(obj['language'])) {
      dict[obj['language']] = 1
    }
    dict[obj['language']] += 1
  }

  let max = 0
  for (let obj in dict) {
    if (max < dict[obj]) {
      max = dict[obj]
    }
  }

  let keys = Object.keys(dict)
  let vals = Object.values(dict)
  for (let i = 0; i < vals.length; i++) {
    if (max === vals[i]) {
      lang = keys[i]
      break
    }
  }

  return lang
}

// param: repo, checks to see if 50%+ repos have been forked returns bool
const forker = repo => {
  let forkCount = 0
  for (let obj of repo) {
    if (obj['fork'] === true) {
      forkCount += 1
    }
  }
  if (forkCount >= repo.length / 2) {
    return true
  }
  return false
}
// param: repo, checks to see if 100% langs used in repo returns bool
const pony = repo => {
  let langs = new Set()
  for (let obj of repo) {
    langs.add(obj['language'])
  }
  return langs
}
// creates an object in the specialized format from the user and repo
const createObj = (user, repos) => {
  let specObj = {}
  let sgcount = sg(repos)
  let hscount = highestStars(repos)
  let prcount = perfRepos(repos)
  let lang = favLang(repos)
  let fork = forker(repos)
  let langsUsed = pony(repos)
  specObj['username'] = user.login
  specObj['name'] = user.name
  specObj['location'] = user.location
  specObj['bio'] = user.bio
  specObj['avatar_url'] = user.avatar_url
  specObj['titles'] = []
  if (fork) {
    specObj['titles'].push('Forker')
  }
  if (langsUsed.length === 1) {
    specObj['titles'].push('One Trick Pony')
  }
  if (langsUsed.size >= 10) {
    specObj['titles'].push('Jack of All Trades')
  }
  if (
    user.followers <= user.following * 2 === true &&
    user.followers != user.following === true
  ) {
    specObj['titles'].push('Stalker')
  }
  if (user.followers >= user.following * 2) {
    specObj['titles'].push('Mr. Popular')
  }
  // custom title
  if (user.location == 'Boston, MA' || user.location == 'Boston') {
    specObj['titles'].push('Brady Bunch TB12')
  }
  specObj['favorite_language'] = lang
  specObj['public_repos'] = user.public_repos
  specObj['total_stars'] = sgcount
  specObj['highest_starred'] = hscount
  specObj['perfect_repos'] = prcount
  specObj['followers'] = user.followers
  specObj['following'] = user.following
  specObj['email'] = user.email
  return specObj
}

export default () => {
  let router = Router()
  // route to test token #s
  router.get('/rate', (req, res) => {
    axios
      .get(`http://api.github.com/rate_limit`, {
        headers: {
          Authorization: token
        }
      })
      .then(({ data }) => res.json(data))
  })
  /** GET /health-check - Check service health */
  router.get('/health-check', (req, res) => res.send('OK'))

  /** GET /api/user/:username - Get user */
  router.get('/user/:username', validate(validation.user), (req, res) => {
    const username = req.params.username

    Promise.all([
      axios
        .get(`http://api.github.com/users/${username}`, {
          headers: {
            Authorization: token
          }
        })
        .then(data => data.data),
      axios
        .get(`http://api.github.com/users/${username}/repos`, {
          headers: {
            Authorization: token
          }
        })
        .then(data => data.data)
    ])
      .then(([user, repos]) => {
        let specObj = createObj(user, repos)
        res.json(specObj)
      })
      .catch(e => {
        res.json({
          error: `The user ${username} does not exist`
        })
        // console.log(e)
      })
  })

  /** GET /api/users?username - Get users */
  router.get('/users/', validate(validation.users), (req, res) => {
    const username = req.query.username
    const users = []
    Promise.all([
      axios
        .get(`http://api.github.com/users/${username[0]}`, {
          headers: {
            Authorization: token
          }
        })
        .then(data => data.data)
        .catch(e => {
          res.json({error: `The user ${username[0]} does not exist`})
        }),
      axios
        .get(`http://api.github.com/users/${username[0]}/repos`, {
          headers: {
            Authorization: token
          }
        })
        .then(data => data.data),
      axios
        .get(`http://api.github.com/users/${username[1]}`, {
          headers: {
            Authorization: token
          }
        })
        .then(data => data.data)
        .catch(e => {
          res.json({error: `The user ${username[1]} does not exist`})
        }),
      axios
        .get(`http://api.github.com/users/${username[1]}/repos`, {
          headers: {
            Authorization: token
          }
        })
        .then(data => data.data)
    ])
      .then(([user0, repos0, user1, repos1]) => {
        let specObj = createObj(user0, repos0)
        let specObj1 = createObj(user1, repos1)

        res.json([specObj, specObj1])
      })
      .catch(e => {
        console.log(e)
      })
  })

  return router
}

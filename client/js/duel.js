/* eslint-disable no-undef */

$('form').submit(() => {
  const username = $('form input').val()
  // console.log($('form input[name = username-left]').val())
  const un1 = $('form input[name=username-left]').val()
  const un2 = $('form input[name=username-right]').val()

  console.log(`examining ${un2}`)
  fetch(`http://localhost:3000/api/users?username=${un1}&username=${un2}`)
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        $('span.error').text(data.error)
        throw new PermissionDenied()
      }
      let winNum = declareWinner(data)
      if (winNum >= 3) {
        $('.winnerLeft').removeClass('hide').text(`${data[0]['username']} is the winner!`)
        $('.winnerRight').addClass('hide')
      }
      else{
        $('.winnerRight').removeClass('hide').text(`${data[1]['username']} is the winner!`)
        $('.winnerLeft').addClass('hide')
      }

      $('.usersError').addClass('hide')
      console.log(`Got data for ${un1} and ${un2}`)
      //start left
      $('.left .username').html(data[0]['username'])
      $('.left .full-namel').html(data[0]['name'])
      $('.left .locationl').html(data[0]['location'])
      $('.left .emaill').html(data[0]['email'])
      $('.left .biol').html(`${data[0]['bio']}`)
      $('.left .avatarl').attr('src', `${data[0]['avatar_url']}`)

      $('.left .stat span.titles').html(`${data[0]['titles']}`)
      $('.left .stat span.favorite-language').html(`${data[0]['favorite_language']}`)
      $('.left .stat span.total-stars').html(`${data[0]['total_stars']}`)
      $('.left .stat span.most-starred').html(`${data[0]['highest_starred']}`)
      $('.left .stat span.public-repos').html(`${data[0]['public_repos']}`)
      $('.left .stat span.preposl').html(`${data[0]['perfect_repos']}`)
      $('.left .stat span.followers').html(`${data[0]['followers']}`)

      //start right
      $('.right .username').html(data[1]['username'])
      $('.right .full-namer').html(data[1]['name'])
      $('.right .locationr').html(data[1]['location'])
      $('.right .emailr').html(data[1]['email'])
      $('.right .bior').html(`${data[1]['bio']}`)
      $('.right .avatarr').attr('src', `${data[1]['avatar_url']}`)

      $('.right .stat span.titles').html(`${data[1]['titles']}`)
      $('.right .stat span.favorite-language').html(`${data[1]['favorite_language']}`)
      $('.right .stat span.total-stars').html(`${data[1]['total_stars']}`)
      $('.right .stat span.most-starred').html(`${data[1]['highest_starred']}`)
      $('.right .stat span.public-repos').html(`${data[1]['public_repos']}`)
      $('.right .stat span.preposr').html(`${data[1]['perfect_repos']}`)
      $('.right .stat span.followers').html(`${data[1]['followers']}`)


      $('.duel-container').removeClass('hide')
    }).catch(err => {
      $('.usersError').removeClass('hide')
      $('duel-container').addClass('hide')
      console.log(`Error getting data for ${un1} and ${un2}`)
      console.log(err)
    })

  return false

})
/*
  TODO
  Fetch 2 user's github data and display their profiles side by side
  If there is an error in finding user or both users, display appropriate error
  message stating which user(s) doesn't exist

  It is up to the student to choose how to determine a 'winner'
  and displaying their profile/stats comparison in a way that signifies who won.
 */

 /*Param: array of usernames
 Reutrns: int of score
 adds up values for the player 1. If player 1 >=3 then he is the winner
 */
 const declareWinner = (data) => {
  let leftWinner = 0
  if (data[0]['total_stars'] > data[1]['total_stars']) {
    leftWinner += 1
  }
  if (data[0]['highest_starred'] > data[1]['highest_starred']) {
    leftWinner += 1
  }
  if (data[0]['public_repos'] > data[1]['public_repos']) {
    leftWinner += 1
  }
  if (data[0]['perfect_repos'] > data[1]['perfect_repos']) {
    leftWinner += 1
  }
  if (data[0]['followers'] > data[1]['followers']) {
    leftWinner += 1
  }
  
  return leftWinner
}

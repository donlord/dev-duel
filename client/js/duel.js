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
      console.log(`Got data for ${un1}`)
      console.log(data[0]['name'])
      console.log(data[0]['username'])
      console.log(data[0]['titles'])
      console.log(data[1]['titles'])
      $('.usernamel').html(`${data[0]['username']}`)
      $('.full-namel').html(`${data[0]['name']}`)
      $('.locationl').html(`${data[0]['location']}`)
      $('.emaill').html(`${data[0]['email']}`)
      $('.biol').html(`${data[0]['bio']}`)
      $('.avatarl').attr('src', `${data[0]['avatar_url']}`)

      // couldnt get child / find methods to work so
      // i hacked the values, and then this section
      // wouldnt have the value inserted and im very confused
      $('.titles valuel').html(`${data[0]['titles']}`)
      $('.favorite-language valuel').html(`${data[0]['favorite_language']}`)
      $('.total-stars valuel').html(`${data[0]['total_stars']}`)
      $('.most-starred valuel').html(`${data[0]['highest_starred']}`)
      $('.public-repos valuel').html(`${data[0]['public_repos']}`)
      $('.preposl').html(`${data[0]['perfect_repos']}`)
      $('.followers valuel').html(`${data[0]['followers']}`)

      $('.usernamer').html(`${data[1]['username']}`)
      $('.full-namer').html(`${data[1]['name']}`)
      $('.locationr').html(`${data[1]['location']}`)
      $('.emailr').html(`${data[1]['email']}`)
      $('.bior').html(`${data[1]['bio']}`)
      $('.avatarr').attr('src', `${data[1]['avatar_url']}`)

      // couldnt get child / find methods to work so
      // i hacked the values, and then this section
      // wouldnt have the value inserted and im very confused
      $('.titles valuer').html(`${data[1]['titles']}`)
      $('.favorite-language valuer').html(`${data[1]['favorite_language']}`)
      $('.total-stars valuer').html(`${data[1]['total_stars']}`)
      $('.most-starred valuer').html(`${data[1]['highest_starred']}`)
      $('.public-repos valuer').html(`${data[1]['public_repos']}`)
      $('.prepor').html(`${data[1]['perfect_repos']}`)
      $('.followers valuer').html(`${data[1]['followers']}`)

      $('.duel-container').removeClass('hide')
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

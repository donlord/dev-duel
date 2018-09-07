/* eslint-disable no-undef */
$('form').submit(() => {
  const username = $('form input').val()
  console.log(`examining ${username}`)

  // Fetch data for given user
  // (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
  fetch(`${USER_URL}/${username}`)
    .then(response => response.json()) // Returns parsed json data from response body as promise
    .then(data => {
      console.log(`Got data for ${username}`)
      console.log(data)

      $('.username').html(`${data.username}`)
      $('.full-name').html(`${data.name}`)
      $('.location').html(`${data.location}`)
      $('.email').html(`${data.email}`)
      $('.bio').html(`${data.bio}`)
      $('.avatar').attr('src', `${data.avatar_url}`)
      $('.titles').html(`${data.titles}`)
      $('.favorite-language').html(`${data.favorite_language}`)
      $('.total-stars').html(`${data.total_stars}`)
      $('.most-starred').html(`${data.highest_starred}`)
      $('.public-repos').html(`${data.public_repos}`)
      $('.perfectrepo').html(`${data.perfect_repos}`)
      $('.followers').html(`${data.followers}`)

      $('.user-results').removeClass('hide') // Display '.user-results' element
    })
    .catch(err => {
      console.log(`Error getting data for ${username}`)
      console.log(err)
      /*
        TODO
        If there is an error finding the user, instead toggle the display of the '.user-error' element
        and populate it's inner span '.error' element with an appropriate error message
      */
    })

  return false // return false to prevent default form submission
})

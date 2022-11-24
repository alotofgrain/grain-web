const apiUrl = "https://api.grainbot.danialdav.com/api/v1"
//const apiUrl = "http://localhost:8080/api/v1"

const urlParameters=new URLSearchParams(window.location.search)
let tgWebAppData = urlParameters.get("bottoken")

function initTgWebAppData(data) {
  if (data != null && tgWebAppData != undefined)
    tgWebAppData = data
}

function getAccountOffers() {
  return fetch(`${apiUrl}/account/offers`, {
    headers: { "X-WebAppData": tgWebAppData },
    mode: "cors"
  })
}

function getAccountOffer(offerId) {
  return fetch(`${apiUrl}/account/offers/${offerId}`, {
    headers: { "X-WebAppData": tgWebAppData },
    mode: "cors"
  })
}

function changeAccountOffer(request) {
  return fetch(`${apiUrl}/account/offers/${request.id}`, {
    headers: {
      "X-WebAppData": tgWebAppData,
      "Content-Type":"application/json"
    },
    mode: "cors",
    method: "PUT",
    body: JSON.stringify(request)
  })
}

function putFavorite(offerId) {
  return fetch(`${apiUrl}/offers/favorites/${offerId}`, {
    headers: {
      "X-WebAppData": tgWebAppData,
    },
    mode: "cors",
    method: "PUT"
  })
}

function removeFavorite(offerId) {
  return fetch(`${apiUrl}/offers/favorites/${offerId}`, {
    headers: {
      "X-WebAppData": tgWebAppData,
    },
    mode: "cors",
    method: "DELETE"
  })
}


function deleteAccountOffer(offerId) {
  return fetch(`${apiUrl}/account/offers/${offerId}`, {
    headers: { "X-WebAppData": tgWebAppData },
    mode: "cors",
    method: "DELETE"
  })
}

function getOffers(favorites) {
  if (favorites === undefined) favorites=false
  return fetch(`${apiUrl}/offers?favorites=${favorites}`, {
    headers: { "X-WebAppData": tgWebAppData },
    mode: "cors"
  })
}

function getDeals() {
  return fetch(`${apiUrl}/deals`, {
    headers: { "X-WebAppData": tgWebAppData },
    mode: "cors"
  })
}

function postDeal(request) {
  return fetch(`${apiUrl}/deals`, {
    headers: {
      "X-WebAppData": tgWebAppData,
      "Content-Type":"application/json"
    },
    mode: "cors",
    method: "POST",
    body: JSON.stringify(request)
  })
}

function getUsers() {
  return fetch(`${apiUrl}/users`, {
    headers: { "X-WebAppData": tgWebAppData },
    mode: "cors",
  })
}

function chatWithUser(userId) {
  return fetch(`${apiUrl}/chats/${userId}`, {
    headers: { "X-WebAppData": tgWebAppData },
    mode: "cors",
    method: "PUT"
  })
}

function askUserRoles(userId) {
  return fetch(`${apiUrl}/users/${userId}/roles`, {
    headers: { "X-WebAppData": tgWebAppData },
    mode: "cors",
    method: "PUT"
  })
}

const offerStatus = {
  initial: "initial",
  active: "active",
  dealStarted: "dealStarted",
  dealRejected: "dealRejected",
  completed: "completed",
  deleted: "deleted"
}

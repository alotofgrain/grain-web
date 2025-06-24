//const apiUrl = "http://localhost:8080/api/v1"
const apiUrl = "https://api.danialdav.com/api/v1"
//const apiUrl = "https://api.betagrain.danialdav.com/api/v1"

let tgWebAppData = encodeURIComponent((new URLSearchParams(window.location.search)).get("bottoken"))

function initTgWebAppData(data) {
  if (data !== "" && data !== undefined && data !== null)
    tgWebAppData = data
}

function getAccountOffers() {
  return fetch(`${apiUrl}/account/offers`, {
    headers: { "X-WebAppData": tgWebAppData },
    mode: "cors"
  })
}

function getAccountOffer(offerId, copy) {
  const copyParam = (copy) ? "?copy=true" : ""
  return fetch(`${apiUrl}/account/offers/${offerId}${copyParam}`, {
    headers: { "X-WebAppData": tgWebAppData },
    mode: "cors"
  })
}

function getAccountOfferSchema() {
  return fetch(`${apiUrl}/account/offers/schema`, {
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

function deleteAccountOffer(offerId) {
  return fetch(`${apiUrl}/account/offers/${offerId}`, {
    headers: {
      "X-WebAppData": tgWebAppData,
    },
    mode: "cors",
    method: "DELETE"
  })
}

function addAccountOffer(request) {
  return fetch(`${apiUrl}/account/offers`, {
    headers: {
      "X-WebAppData": tgWebAppData,
      "Content-Type":"application/json"
    },
    mode: "cors",
    method: "POST",
    body: JSON.stringify(request)
  })
}

function getAccountBidSchema() {
  return fetch(`${apiUrl}/account/bids/schema`, {
    headers: { "X-WebAppData": tgWebAppData },
    mode: "cors"
  })
}

function getAccountBid(bidId) {
  return fetch(`${apiUrl}/account/bids/${bidId}`, {
    headers: { "X-WebAppData": tgWebAppData },
    mode: "cors"
  })
}

function getAccountBids() {
  return fetch(`${apiUrl}/account/bids`, {
    headers: { "X-WebAppData": tgWebAppData },
    mode: "cors"
  })
}


function addAccountBid(request) {
  return fetch(`${apiUrl}/account/bids`, {
    headers: {
      "X-WebAppData": tgWebAppData,
      "Content-Type":"application/json"
    },
    mode: "cors",
    method: "POST",
    body: JSON.stringify(request)
  })
}

function changeAccountBid(request) {
  return fetch(`${apiUrl}/account/bids/${request.id}`, {
    headers: {
      "X-WebAppData": tgWebAppData,
      "Content-Type":"application/json"
    },
    mode: "cors",
    method: "PUT",
    body: JSON.stringify(request)
  })
}

function deleteAccountBid(offerId) {
  return fetch(`${apiUrl}/account/bids/${offerId}`, {
    headers: {
      "X-WebAppData": tgWebAppData,
    },
    mode: "cors",
    method: "DELETE"
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

function getOffers(favorites) {
  if (favorites === undefined) favorites=false
  return fetch(`${apiUrl}/offers?favorites=${favorites}`, {
    headers: { "X-WebAppData": tgWebAppData },
    mode: "cors"
  })
}

function getOffer(offerId) {
  return fetch(`${apiUrl}/offers/${offerId}`, {
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

function getBids() {
  return fetch(`${apiUrl}/bids`, {
    headers: { "X-WebAppData": tgWebAppData },
    mode: "cors"
  })
}

function getBid(bidId) {
  return fetch(`${apiUrl}/bids/${bidId}`, {
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

function getOffersReplies() {
  return fetch(`${apiUrl}/offers/replies`, {
    headers: { "X-WebAppData": tgWebAppData },
    mode: "cors"
  })
}

function releaseOfferMatches(request) {
  return fetch(`${apiUrl}/offers/matches/release`, {
    headers: {
      "X-WebAppData": tgWebAppData,
      "Content-Type":"application/json"
    },
    mode: "cors",
    method: "PATCH",
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

const bidStatus = {
  initial: "initial",
  active: "active",
  completed: "completed",
  deleted: "deleted"
}


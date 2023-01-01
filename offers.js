function offersList(response, offersListArgs = { favorites: false, exitCallback: null, favButton: true, bidId: null}) {
  const element = document.createElement("div")
  element.style.display = "flex"
  element.style.flexDirection = "column"
  element.style.width = "100%"
  response.page.forEach((item) => {
    element.appendChild(offerCard(item, offersListArgs))
  })
  return element
}

function starCountText(starCount) {
  return (starCount === undefined || starCount === 0 || isNaN(starCount)) ? "" : `${starCount}`
}

function offerCard(offer, offersListArgs = { favorites: false, exitCallback: null, favButton: true, bidId: null}) {
  const element = document.createElement("div")
  element.style.marginBottom="20px"
  element.style.widt="100%"
  const starStyle = (offer.isFavorite) ? "icon-star" : "icon-star-empty"
  const favButtonHTML = !offersListArgs.favButton ? "" :
      `<span style="font-family: monospace">
          <i class=${starStyle} data-id=${offer.id} id="star" ></i>
        <span>${starCountText(offer.favoriteCount)}</span>
       </span>`
  const btnCaption = offer.status === "active" ? "Купить" : offerStatusMap.get(offer.status)
  const disabled = (offer.status !== "active") ? "disabled" : ""
  element.innerHTML=`${buyerOfferHTML(offer)}
                          <div style="display: flex">
                          <button data-id=${offer.id} id="btnOffer" style="padding-left: 1em; padding-right: 1em; flex-grow: 0; border-radius:1em;" ${disabled}>${btnCaption}</button>
                          <span style="flex-grow: 1"></span>
                          ${favButtonHTML}
                        </div>`
  if (offer.status === "active") {
    element.querySelector("#btnOffer").addEventListener("click", (event => {
      showDealDialog(offer, offersListArgs)
    }))
  }

  if (offersListArgs.favButton) element.querySelector("#star").addEventListener("click", onClickStar)
  return element
}

function onClickStar(event) {
  const offerId = parseInt(event.target.getAttribute("data-id"))
  if (event.target.classList.contains("icon-star")) {
    removeFavorite(offerId).then((response) => {
      if (!response.ok) throw new Error(`Response status ${response.status}`)
      const updatedStarCount = parseInt(event.target.parentElement.children[1].innerText) - 1
      event.target.parentElement.children[1].innerText = starCountText(updatedStarCount)
      event.target.classList.remove("icon-star")
      event.target.classList.add("icon-star-empty")
    }).catch((error) => displayError(error))
  } else {
    putFavorite(offerId).then((response) => {
      if (!response.ok) throw new Error(`Response status ${response.status}`)
      let starCount = parseInt(event.target.parentElement.children[1].innerText)
      if (starCount === undefined || isNaN(starCount)) starCount = 1
      else starCount = starCount + 1
      event.target.parentElement.children[1].innerText = starCountText(starCount)
      event.target.classList.remove("icon-star-empty")
      event.target.classList.add("icon-star")
    }).catch((error) => displayError(error))
  }
}

function showDealDialog(offer, offersListArgs) {
  const element = document.createElement("div")
  const qtyControl =  (offer.minQty === offer.qty) ?
      `<div style="display:flex;  margin-bottom: 20px;">
          <span style="flex-grow: 1">Количество:</span>
          <output name="qty" style="flex-shrink: 0; font-size:x-large; font-family: monospace;">${offer.qty}</output>
          <span style="flex-shrink: 0; min-width: 2em;">&nbspкг</span>
        </div>`
      :
      `<div style="display:flex;  margin-bottom: 20px;">
          <span style="flex-grow: 1">Доступное количество:</span>
          <output name="availQty" style="flex-shrink: 0; font-size:x-large; font-family: monospace;">${offer.qty}</output>
          <span style="flex-shrink: 0; min-width: 2em;">&nbspкг</span>
        </div>
        <div style="display:flex; margin-bottom: 20px;">
          <span style="flex-grow: 1">Минимальное количество:</span>
          <output name="minQty" style="flex-shrink: 0; font-family: monospace;">${offer.minQty}</output>
          <span style="flex-shrink: 0; min-width: 2em;">&nbspкг</span>
        </div>
        `

  const inputQty = (offer.minQty === offer.qty) ? `` :
      `<div style="display:flex; margin-bottom: 20px;">
          <span style="flex-grow: 1">Количество:</span>
          <input name="qty" type="number" min="${offer.minQty}" max="${offer.qty}" value="${offer.qty}"
                 onInput="this.form.sum.value=this.value*this.form.price.value;" style="flex-shrink: 0; text-align: right; max-width: 10em;">
            <span style="flex-shrink: 0; min-width: 2em;">&nbspкг</span>
        </div>
        `

  const formContent = offer.status === "active" ?
  `                          <div style="display:flex; font-weight:bold; font-size: large;  margin-top: 30px; margin-bottom: 30px;">
                            <span style="flex-grow: 1">Сумма:</span>
                            <output name="sum" style="flex-shrink: 0; font-size:x-large; font-family: monospace;">${offer.price * offer.qty}</output>
                            <span style="flex-shrink: 0">&nbspтг</span>
                          </div>
                          <div style="display:flex;  margin-bottom: 20px;">
                            <span style="flex-grow: 1">Цена:</span>
                            <output name="price" style="flex-shrink: 0; font-size:x-large; font-family: monospace;">${offer.price}</output>
                            <span style="flex-shrink: 0; min-width: 2em;">&nbspтг</span>
                          </div>
                          ${qtyControl}
                          ${inputQty}
                          <div style="text-align: center; font-size: large;">
                                 <button data-id=${offer.id} id="btnConfirmBuy" type="button" style="font-size: inherit; margin: 0.5em; padding-left: 1em; padding-right: 1em; flex-grow: 0; border-radius:1em;">Оформить</button>
                                 <button data-id=${offer.id} id="btnCancel"  type="button"  style="font-size: inherit; margin: 0.5em; padding-left: 1em; padding-right: 1em; flex-grow: 0; border-radius:1em;">Отмена</button>
                          </div>
` : `
            <div style="text-align: center; font-size: large;">
                <button data-id=${offer.id} id="btnCancel"  type="button"  style="font-size: inherit; margin: 0.5em; padding-left: 1em; padding-right: 1em; flex-grow: 0; border-radius:1em;">Закрыть</button>
            </div>
`
  const grey = offer.status === "active" ? "" : "grey"

  element.innerHTML=`
                        <div class="hint ${grey}" style ="font-size: x-large; text-align: center; margin-bottom: 20px;  ">Покупка</div>
                        ${buyerOfferHTML(offer)}
                        <form style="display: flex; flex-direction: column; margin-bottom: 20px;">
                        ${formContent}
                        </form>`

    if (offer.status === "active") {
      element.querySelector("#btnConfirmBuy").addEventListener("click", (event => {
        onClickConfirmBuy(event, offer, offersListArgs)
      }))
    }
    element.querySelector("#btnCancel").addEventListener("click", offersListArgs.exitCallback)
  document.body.innerHTML = ""
  document.body.appendChild(element)
}

function onClickConfirmBuy(event, offer, offersListArgs) {
  const request =  {
    offerId: offer.id,
    qty: parseInt(event.target.form.qty.value),
    bidId: offersListArgs.bidId
  }

  if (request.qty >= offer.minQty && request.qty <= offer.qty) {
    postDeal(request)
        .then((response) => {
          if (!response.ok) throw new Error(`Response status ${response.status}`)
          tg.close()
        }).catch((error) => displayError(error))

  } else {
    event.target.form.qty.focus()
    return
  }
}
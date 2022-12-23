import DataForm from "./data-form.js";

export function navigateOffers(addOfferArgs = {copyFrom: null, replyOn: null, exitCallback: null}) {
  getAccountOffers().then((response) => {
    if (!response.ok) throw new Error(`Response status ${response.status}`)
    else return response.json()
  }).then((response) => {
    const check = (addOfferArgs?.copyFrom != null || addOfferArgs?.replyOn != null)
    if (addOfferArgs.exitCallback == null) addOfferArgs.exitCallback = navigateOffers
    const caption = pageCaption({
      title: check ? "Выберите лот" : "Мои лоты",
      buttons: check ? null : [{
        id: "btnAdd",
        icon: "icon-plus-outline",
        clickHandler: (event => {addOffer({ exitCallback: () => navigateOffers() })})
      }]
    })
    document.body.innerHTML = ""
    document.body.appendChild(caption)
    const list = offersList(response, addOfferArgs)
    document.body.appendChild(list)
  }).catch((error) => displayError(error))
}

export function navigateOffer(offerId, addOfferArgs = {copyFrom: null, replyOn: null, exitCallback: null}) {
  getAccountOffer(offerId).then((response) => {
    if (!response.ok) throw new Error(`Response status ${response.status}`)
    else return response.json()
  }).then((offer) => {
    if (addOfferArgs.exitCallback == null) addOfferArgs.exitCallback = navigateOffers
    showOfferDialog(offer, addOfferArgs)
  }).catch((error) => displayError(error))
}


export function addOffer(addOfferArgs = {copyFrom: null, replyOn: null, exitCallback: null, attributes: null}) {
  getAccountOfferSchema().then((response) => {
    if (!response.ok) throw new Error(`Response status ${response.status}`)
    else return response.json()
  }).then(schema => {
    if (addOfferArgs.copyFrom != null) {
      return getAccountOffer(addOfferArgs.copyFrom, true).then((response) => {
        if (!response.ok) throw new Error(`Response status ${response.status}`)
        else return response.json().then(data => {return Promise.resolve([schema, data.attributes])})
      })
    } else {
      const attributesCopy = {
        "Культура": addOfferArgs?.attributes["Культура"],
        "Класс": addOfferArgs?.attributes["Класс"]
      }
      return Promise.resolve([schema, attributesCopy])
    }
  }).then( schemaAndData => {
    const caption = pageCaption({title: "Новый лот"})
    const form = new DataForm(schemaAndData[0], schemaAndData[1])
    form.getFormElement().appendChild(addOfferButtons(form, addOfferArgs))
    document.body.innerHTML = ""
    document.body.appendChild(caption)
    document.body.appendChild(form.getFormElement())
  }).catch((error) => displayError(error))
}


function addOfferButtons(form, addOfferArgs = {copyFrom: null, replyOn: null, exitCallback: null}) {
  const element = document.createElement("div")
  element.innerHTML = `
    <button id="btnContinue" type="button" style="flex-grow: 0; font-size: large; margin: 0.5em 4em; padding-left: 1em; padding-right: 1em; border-radius:1em;">Продолжить</button>
    <button id="btnCancel" type="button" style="flex-grow: 0; font-size: large; margin: 0.5em 4em; padding-left: 1em; padding-right: 1em; border-radius:1em;">Отмена</button>
    `
  element.querySelector("#btnContinue").addEventListener("click", (event => {clickAddOfferContinue(form, addOfferArgs) }))
  element.querySelector("#btnCancel").addEventListener("click", (event => { clickAddOfferCancel(addOfferArgs) }))
  return element
}

function clickAddOfferContinue(form, addOfferArgs = {copyFrom: null, replyOn: null, exitCallback: null}) {
  const data = form.getData()
  if (data === null) return
  addAccountOffer({
    attributes: data,
    replyOn: addOfferArgs.replyOn
  }).then(response => {
    if (response.ok || response.status === 400)
      return response.json()
    else
      return response.text()
          .then(value => {throw new Error(`${value} (Response status ${response.status})`)})
  }).then(result => {
    if (result.success) navigateOffer(result.id, addOfferArgs)
    else if (result.errors) form.showErrors(result.errors)
    else if (result.error) displayError(result.error)
    else throw new Error(`(Response status ${result})`)
  }).catch((error) => displayError(error))
}

function clickAddOfferCancel(addOfferArgs = {copyFrom: null, replyOn: null, exitCallback: null}) {
  addOfferArgs.exitCallback()
}

function offersList(response, addOfferArgs = {copyFrom: null, replyOn: null, exitCallback: null}) {
  if (response.page.length < 1) return emptyList(addOfferArgs)
  const element = document.createElement("div")
  element.style.display = "flex"
  element.style.flexDirection = "column"
  response.page.forEach((item) => {
    element.appendChild(offerCard(item, addOfferArgs))
  })
  return element
}

function offerCard(item, addOfferArgs = {copyFrom: null, replyOn: null, exitCallback: null}) {
  const element = document.createElement("div")
  element.style.width = "100%"
  element.style.marginBottom = "1em"
  if (item.status === offerStatus.deleted) {
    element.style.color = "grey"
  }
  const copyButton = addOfferArgs?.copyFrom != null || addOfferArgs?.replyOn != null
  const disabled = (item.status === offerStatus.deleted && !copyButton) ? "disabled" : ""
  const stars = (item.favoriteCount === undefined || item.favoriteCount === 0) ? "" :
      `<span style="font-family: monospace"><i class="icon-star-empty"></i>${item.favoriteCount}</span>`
  const btnOfferCaption = copyButton ? "Копировать" : offerStatusMap.get(item.status)
  element.innerHTML=`${offerCardHTML(item)}
                        <div style="display: flex">
                          <button data-id=${item.id} id="btnOffer" style="padding-left: 1em; padding-right: 1em; flex-grow: 0; border-radius:1em;" ${disabled}>${btnOfferCaption}</button>
                          <div style="flex-grow: 1"></div>
                          <!-- span style="flex-grow: 1"><i class="icon-attention"></i></span -->
                          <!-- span><i class="icon-chat-empty"></i></span -->
                          ${stars}
                        </div>`
  const newArgs = { ...addOfferArgs, copyFrom: item.id }
  const btnOfferClickHandler = copyButton ? (event => {addOffer(newArgs)}) : onClickStatus
  element.querySelector("#btnOffer").addEventListener("click", btnOfferClickHandler)
  return element
}

function offerCardHTML(offer) {
  return `<div style="display: flex;">
                          ${offerIcon(offer)}
                          <span style="flex-grow: 1; font-weight: bold">${offer.attributes["Номер ЗР"] || "#" + offer.id}</span>
                          <span style="flex-shrink: 0;font-family: monospace; font-weight: bolder">${offer.price} тг</span>
                        </div>
                        <div style="display: flex">
                          <span style="flex-grow: 1; font-size: smaller">${offer.attributes["Культура"]}</span>
                          <span style="flex-shrink: 0; font-size: smaller; font-family: monospace; font-weight: bolder">${offer.qty} кг</span>
                        </div>
                        <div style ="font-size: small">Дата выпуска: ${offer.attributes["Дата выпуска"]}</div>
                        <div style="display: flex">
                          <span style ="flex-grow: 1; font-size: small">${offer.attributes["Хлебоприемное предприятие_short"]}</span>
                          <span style ="flex-shrink: 0; font-size: small">${offer.attributes["Область"]}</span>
                        </div>
                        <div style="display: flex">
                          <span style="flex-grow: 1; font-size: x-small">${offer.attributes["Налоги"]}</span>
                        </div>`
}


function onClickStatus(event) {
  const offerId = event.target.getAttribute("data-id")
  navigateOffer(offerId)
}

function showOfferDialog(offer, addOfferArgs = {copyFrom: null, replyOn: null, exitCallback: null}) {
  document.body.innerHTML = ""
  const caption = pageCaption({
    title: "",
    buttons: (addOfferArgs.copyFrom != null || addOfferArgs.replyOn != null) ? null : [{
      id: "btnCopy",
      icon: "icon-popup",
      clickHandler: (event => {addOffer({ copyFrom: offer.id , exitCallback: () => { navigateOffers() }})})
    }]
  })
  const element = offerDialog(offer, addOfferArgs)
  document.body.appendChild(caption)
  document.body.appendChild(element)
}

function offerDialog(offer, addOfferArgs) {
  const element = document.createElement("div")
  element.innerHTML=`
                        <div class="hint" style ="font-size: x-large; text-align: center; margin-bottom: 20px;  ">Лот на продажу</div>
                        ${offerCardHTML(offer)}
                        <form style="display: flex; flex-direction: column; margin-top: 20px;">
                          <!-- div style="display:flex; font-weight:bold; font-size: large;  margin-top: 30px; margin-bottom: 30px;">
                            <span style="flex-grow: 1">Сумма:</span>
                            <output name="sum" style="flex-shrink: 0; font-size:x-large; font-family: monospace;">${offer.price * offer.qty}</output>
                            <span style="flex-shrink: 0">&nbspтг</span>
                          </div -->
                          <div style="display:flex;  margin-bottom: 20px;">
                            <span style="flex-grow: 1">Цена:</span>
                            <input  type="number" name="price" style="flex-shrink: 0; text-align: right; max-width: 10em;" value="${offer.price}">
                            <span style="flex-shrink: 0; min-width: 2em;">&nbspтг</span>
                          </div>
                          <input type="hidden" name="qty" value="${offer.qty}">
                          <!-- div style="display:flex;  margin-bottom: 20px;">
                            <span style="flex-grow: 1">Продавать целиком</span>
                            <input  type="checkbox" name="sellEntire" style="flex-shrink: 0; font-size:x-large; font-family: monospace;" value="true">
                            <span style="flex-shrink: 0; min-width: 2em;">&nbsp</span>
                          </div -->
                          <div style="display:flex; margin-bottom: 20px;">
                            <span style="flex-grow: 1">Минимальное Кол-во:</span>
                            <input name="minQty" type="number" min="1000" max="${offer.qty}" value="${offer.minQty}" style="flex-shrink: 0; text-align: right; max-width: 10em;">
                            <span style="flex-shrink: 0; min-width: 2em;">&nbspкг</span>
                          </div>
                         <button data-id="${offer.id}" id="btnContinue" type="button" style="flex-grow: 0; font-size: large; margin: 0.5em 4em; padding-left: 1em; padding-right: 1em; flex-grow: 0; border-radius:1em;">Продолжить</button>
                         <button data-id="${offer.id}" id="btnDelete" type="button" style="flex-grow: 0; font-size: large; margin: 0.5em 4em; padding-left: 1em; padding-right: 1em; border-radius:1em;">Удалить лот</button>
                        </form>`
  element.querySelector("#btnContinue").addEventListener("click", (event => { onClickContinue(event, addOfferArgs) }))
  element.querySelector("#btnDelete").addEventListener("click", (event => { onClickDeleteOffer(event, addOfferArgs) }))
  element.querySelector("form").offerAttributes = offer.attributes
  return element
}

function onClickContinue(event, addOfferArgs) {
  const request =  {
    id: parseInt(event.target.getAttribute("data-id")),
    price: parseFloat(event.target.form.price.value),
    qty: parseInt(event.target.form.qty.value),
    minQty: parseInt(event.target.form.minQty.value),
    step: 0
  }

  if (isNaN(request.price) || request.price === undefined || request.price <= 1 || request.price > 1000000) {
    event.target.form.price.focus()
    return
  }

  if (isNaN(request.minQty) || request.minQty === undefined || request.minQty <= 1 || request.minQty > request.qty) {
    event.target.form.minQty.focus()
    return
  }

  changeAccountOffer(request)
      .then((response) => {
        if (!response.ok) throw new Error(`Response status ${response.status}`)
        addOfferArgs.exitCallback()
      }).catch((error) => displayError(error))
}

function onClickDeleteOffer(event, addOfferArgs) {
  const offerId = event.target.getAttribute("data-id")
  if (offerId == null) {
    addOfferArgs.exitCallback()
  } else {
    deleteAccountOffer(offerId)
        .then((response) => {
          if (!response.ok) throw new Error(`Response status ${response.status}`)
          addOfferArgs.exitCallback()
        })
        .catch((error) => displayError(error))
  }
}

function emptyList(addOfferArgs) {
  const element = document.createElement("div")
  element.classList.add("hint")
  if (addOfferArgs?.replyOn == null) {
    element.innerHTML = `У вас пока нет лотов на продажу. Чтобы добавить лот загрузите зерновую расписку в формате PDF
    или нажмите <i class="icon-plus-outline" ></i> вверху справа`
  } else {
    element.innerHTML = `<div>У вас пока нет лотов на продажу...</div>
    <button id="btnAddOffer" type="button" style="font-size: inherit; margin: 0.5em; padding-left: 1em; padding-right: 1em; flex-grow: 0; border-radius:1em;">Заполнить вручную</button>
    `
    element.querySelector("#btnAddOffer").addEventListener("click", (event => {addOffer(addOfferArgs)}))
  }
  return element
}

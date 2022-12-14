const pageVersion = 1

const offerStatusMap = new Map()
offerStatusMap.set("initial", "Новый")
offerStatusMap.set("active", "Активный")
offerStatusMap.set("dealStarted", "Сделка")
offerStatusMap.set("dealRejected", "Отказано")
offerStatusMap.set("completed", "Завершено")
offerStatusMap.set("deleted", "Удален")

const bidStatusMap = new Map()
bidStatusMap.set("initial", "Новая")
bidStatusMap.set("active", "Активная")
bidStatusMap.set("completed", "Завершена")
bidStatusMap.set("deleted", "Удалена")


function pageCaption(data) {
  const element = document.createElement("div")
  element.style.display = "flex"
  element.style.width = "100%"
  //element.classList.add
  const buttonsHtml = (data.buttons == null) ? "" :
      data.buttons.map(button => {
        return `<i id="${button.id}" class="${button.icon}"  style="flex-grow: 0"></i>`
      }).join("\n")
  const html = `<div style="flex-grow: 1; text-align: center">${data.title}</div>${buttonsHtml}`
  element.innerHTML = html
  if (data.buttons != null) {
    data.buttons.forEach(button => {
      if (button.clickHandler != null)
        element.querySelector(`#${button.id}`).addEventListener("click", button.clickHandler)
    })
  }
  return element
}

function displayError(error) {
  document.body.innerHTML = ""
  const title = document.createElement("p")
  title.classList.add("hint")
  title.textContent = `Error`
  document.body.appendChild(title)
  const errorLabel = document.createElement("p")
  errorLabel.classList.add("hint")
  errorLabel.textContent = `${error}`
  document.body.appendChild(errorLabel)
}

function buyerOfferHTML(offer, withSelection = false, withCre = false) {
  const additionalProperties =["Год урожая", "Влажность, %", "Примесь сорная, %", "Примесь зерновая/масличная, %",
    "Натура", "Клейковина, %",  "Клейковина, усл.ед.", "Число падения, с", "Белок, %", "Стекловидность, %"]
  const additionalPropertiesHtml = additionalProperties.map( (propName) =>
      `<span style ="flex-shrink: 0; font-size: small">${propName}:&nbsp${offer.attributes[propName]}&nbsp&nbsp</span>`
  ).join("")
  const checkBox = !withSelection ? ``: `<input type="checkbox" data-id="${offer.id}">`
  //const creColor = (withCre && offer.cre < yesturday) ? `color: lightcoral;` : ``
  const creColor = ``
  const creStr = !withCre ? `` : `<div style = "display: flex; flex-wrap: wrap; ${creColor}">${(new Date(offer.cre)).toLocaleDateString()}</div>`
  return `<div style="display: flex;">
            <span style="flex-grow: 1; font-weight: bold">
            ${checkBox}
            ${offerIcon(offer)}                        
            #${offer.id}&nbsp&nbsp${offer.attributes["Культура"]}
            </span>
            <span style="flex-shrink: 0;font-family: monospace; font-weight: bolder">${offer.price} тг</span>
          </div>
          <div style="display: flex">
            <span style="flex-grow: 1;">${offer.attributes["Класс"]}</span>
            <span style="flex-shrink: 0; font-size: smaller; font-family: monospace; font-weight: bolder">${offer.qty} кг</span>
          </div>
          <div style = "display: flex; flex-wrap: wrap;">${additionalPropertiesHtml}</div>
          ${creStr}
       `
}

function rangeText(propName, range) {

  if (range == null || (range.from == 0 && range.to == 100) || (range.from == null && range.to == null) ) return ""
  else if (range.from == range.to ) return `${propName}: ${range.from}`
  else if (range.from != null && range.to == null) return `${propName}: >${range.from}`
  else if (range.to != null && range.from == null) return `${propName}: <${range.to}`
  else return `${propName}: ${range.from} — ${range.to}`
}

function bidHTML(bid) {
  const additionalProperties =["Натура", "Клейковина, %",  "Число падения, с", "Белок, %", "Стекловидность, %"]
  const additionalPropertiesHtml = additionalProperties.map( (propName) =>
      `<span style ="flex-shrink: 0; font-size: small">${rangeText(propName, bid.attributes[propName])}&nbsp&nbsp</span>`
  ).join("")
  const grey = (bid.status === "active" || bid.status === "initial") ? "" : "grey"
  return `<div style="display: flex;" class="${grey}">
                          <span style="flex-grow: 1; font-weight: bold">${"#" + bid.id}</span>
                          <span style="flex-shrink: 0;font-family: monospace; font-weight: bolder">${bid.price} тг</span>
                        </div>
                        <div style="display: flex">
                          <span style="flex-grow: 1; font-size: smaller">${bid.attributes["Культура"]}</span>
                          <span style="flex-shrink: 0; font-size: smaller; font-family: monospace; font-weight: bolder">${bid.qty} кг</span>
                        </div>
                        <div style ="font-size: smaller">${bid.attributes["Класс"] ?? ""}</div>
                        <div style="display: flex">
                          <span style ="flex-shrink: 0; font-size: small">${bid.attributes["Область"]}</span>
                        </div>
                        <div style = "display: flex; flex-wrap: wrap;">${additionalPropertiesHtml}</div>`
}

function matchesBriefList(bidOrOffer, isBid) {
  return bidOrOffer.matches.map(item => {
    const sign = item.status === "active"? "icon-reply-outline": "icon-reply"
    const greyStyle = item.status === "active" ? "": `style="color: grey"`
    const signStyle = isBid ? "": "transform: scaleX(-1)"
    return `<div ${greyStyle}><span class="${sign}" style="${signStyle}"></span><span>${item.price}</span><span class="icon-cancel"></span><span>${item.qty}</span></div>`
  }).join("\n")
}

function offerIcon(offer) {
  return offer.public ?  "" :
      (offer.status == "active" ? `<i class="icon-reply-outline"></i>` : `<i class="icon-reply"></i>`)
}

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

function buyerOfferHTML(offer) {
  const additionalProperties =["Год урожая", "Влажность, %", "Примесь сорная, %", "Примесь зерновая/масличная, %",
    "Натура", "Клейковина, %",  "Клейковина, усл.ед.", "Число падения, с", "Белок, %", "Стекловидность, %"]
  const additionalPropertiesHtml = additionalProperties.map( (propName) =>
      `<span style ="flex-shrink: 0; font-size: small">${propName}:&nbsp${offer.attributes[propName]}&nbsp&nbsp</span>`
  ).join("")
  return `<div style="display: flex;">
            <span style="flex-grow: 1; font-weight: bold">${offer.attributes["Культура"]}</span>
            <span style="flex-shrink: 0;font-family: monospace; font-weight: bolder">${offer.price} тг</span>
          </div>
          <div style="display: flex">
            <span style="flex-grow: 1;">${offer.attributes["Класс"]}</span>
            <span style="flex-shrink: 0; font-size: smaller; font-family: monospace; font-weight: bolder">${offer.qty} кг</span>
          </div>
          <div style = "display: flex; flex-wrap: wrap;">${additionalPropertiesHtml}</div>`
}

function rangeText(propName, range) {
  if ((range.from == 0 && range.to == 100) || (range.from == null && range.to == null) ) return ""
  else if (range.from == range.to ) return `${propName}: ${range.from}`
  else if (range.from > 0 && range.to < 100) return `${propName}: ${range.from} — ${range.to}`
  else if (range.from > 0) return `${propName}: >${range.from}`
  else if (range.to > 0) return `${propName}: <${range.to}`
  else return "?"
}

function bidHTML(bid) {
  const additionalProperties =["Натура", "Клейковина, %",  "Число падения, с", "Белок, %", "Стекловидность, %"]
  const additionalPropertiesHtml = additionalProperties.map( (propName) =>
      `<span style ="flex-shrink: 0; font-size: small">${rangeText(propName, bid.attributes[propName])}&nbsp&nbsp</span>`
  ).join("")
  return `<div style="display: flex;">
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


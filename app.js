const statusMap = new Map()
statusMap.set("initial", "Новый")
statusMap.set("active", "Активный")
statusMap.set("dealStarted", "Сделка")
statusMap.set("dealRejected", "Отказано")
statusMap.set("completed", "Завершено")
statusMap.set("deleted", "Удален")


function pageCaption(data) {
  const element = document.createElement("div")
  element.style.display = "flex"
  element.style.width = "100%"
  //element.classList.add
  const buttonsHtml = (data.buttons === undefined) ? "" :
      data.buttons.map(button => {
        return `<i id="${button.id}" class="${button.icon}"  style="flex-grow: 0"></i>`
      }).join("\n")
  const html = `<div style="flex-grow: 1; text-align: center">${data.title}</div>${buttonsHtml}`
  element.innerHTML = html
  if (data.buttons !== undefined) {
    data.buttons.forEach(button => {
      if (button.clickHandler !== undefined)
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


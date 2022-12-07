const statusMap = new Map()
statusMap.set("initial", "Новый")
statusMap.set("active", "Активный")
statusMap.set("dealStarted", "Сделка")
statusMap.set("dealRejected", "Отказано")
statusMap.set("completed", "Завершено")
statusMap.set("deleted", "Удален")


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


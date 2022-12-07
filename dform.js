
function schemaToForm(schema) {
  const attributesHtml = schema.map((attribute) => {
    const generator = generatorByType[attribute["@c"]]
    if (generator === undefined) {
      console.error(`No generator for attribute of type "${attribute["@c"]}"`)
      return ``
    } else {
      return generator(attribute)
    }
  }).join("\n")
  return `
  <form class="dform">
    ${attributesHtml}
  </form>  
  `
}


function stringAttribute(descriptor) {
  return `
   <div class="dform-attribute dform-wide-attribute">   
    <span class="dform-attribute-caption">${descriptor.name}</span>
    <input class="dform-attribute-input-string" name="${descriptor.name}" type="text">
   </div>
  `
}

function enumAttribute(descriptor) {
  const options =  descriptor.values.map( value => `<option value="${value}">${value}</option>`).join("\n")
  return `
   <div class="dform-attribute ${(descriptor.multi == true) ? "dform-wide-attribute" :""}">   
    <span class="dform-attribute-caption">${descriptor.name}</span>
        <select ${(descriptor.multi == true) ? "multiple" :""} search='true'>
           ${options}                 
        </select>
   </div>
  `
}

function rangeAttribute(descriptor) {
  const minConstraint = (descriptor.range !== undefined && descriptor.range.from !== undefined) ? `min="${descriptor.range.from}"` : ``
  const maxConstraint = (descriptor.range !== undefined && descriptor.range.to !== undefined) ? `max="${descriptor.range.to}"` : ``
  return `
   <div class="dform-attribute">   
    <span class="dform-attribute-caption">${descriptor.name}</span>
    <input class="dform-attribute-input-numeric-range" name="${descriptor.name}_from" type="number" ${minConstraint} ${maxConstraint}>
    <input class="dform-attribute-input-numeric-range" name="${descriptor.name}_to" type="number" ${minConstraint} ${maxConstraint}>
   </div>
  `
}

function numericAttribute(descriptor) {
  const minConstraint = (descriptor.range !== undefined && descriptor.range.from !== undefined) ? `min="${descriptor.range.from}"` : ``
  const maxConstraint = (descriptor.range !== undefined && descriptor.range.to !== undefined) ? `max="${descriptor.range.to}"` : ``
  return `
   <div class="dform-attribute">   
    <span class="dform-attribute-caption">${descriptor.name}</span>
    <input class="dform-attribute-input-numeric" name="${descriptor.name}" type="number" ${minConstraint} ${maxConstraint}>
   </div>
  `
}


const generatorByType = {
  ".AttributeDescriptor$String": stringAttribute,
  ".AttributeDescriptor$Enum": enumAttribute,
  ".AttributeDescriptor$Range": rangeAttribute,
  ".AttributeDescriptor$Numeric": numericAttribute,
}
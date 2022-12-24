function DataForm(schema, data = undefined) {

  function stringAttribute(descriptor, value = undefined) {
    return `
   <div class="dform-attribute dform-wide-attribute">   
    <span class="dform-attribute-caption">${descriptor.name}</span>
    <input class="dform-attribute-input-string" name="${descriptor.name}" type="text" value="${value || ""}">
   </div>
  `
  }

  function enumAttribute(descriptor, value = undefined) {
    const valueSet = (value == null) ? new Set() :
        ((descriptor.multi === true) ? new Set(value) : new Set(Array(value)))
    const options = descriptor.values.map(v => {
      const selected = (valueSet.has(v)) ? "selected" : ""
      return `<option value="${v}" ${selected}>${v}</option>`
    }).join("\n")
    return `
   <div class="dform-attribute ${(descriptor.multi == true) ? "dform-wide-attribute" : ""}">   
    <span class="dform-attribute-caption">${descriptor.name}</span>
        <select ${(descriptor.multi == true) ? "multiple" : ""} search='true' name="${descriptor.name}">
           ${options}                 
        </select>
   </div>
  `
  }

  function rangeAttribute(descriptor, value = undefined) {
    const fromValue = (value == null || value.from == null) ? "" : value.from
    const toValue = (value == null || value.to == null) ? "" : value.to
    const minConstraint = (descriptor.range !== undefined && descriptor.range.from != null)
        ? `min="${descriptor.range.from}"` : ``
    const maxConstraint = (descriptor.range !== undefined && descriptor.range.to != null)
        ? `max="${descriptor.range.to}"` : ``
    const fromType = minConstraint === "" && maxConstraint !== "" ? "hidden" : "number"
    const toType = minConstraint !== "" && maxConstraint === "" ? "hidden" : "number"
    return `
   <div class="dform-attribute">   
    <span class="dform-attribute-caption">${descriptor.name}</span>
    <input class="dform-attribute-input-numeric-range" name="${descriptor.name}_from"
      type="${fromType}" value="${fromValue}" ${minConstraint} ${maxConstraint}>
    <input class="dform-attribute-input-numeric-range" name="${descriptor.name}_to"
      type="${toType}" value="${toValue}" ${minConstraint} ${maxConstraint}>
   </div>
  `
  }

  function numericAttribute(descriptor, value = undefined) {
    const minConstraint = (descriptor.range !== undefined && descriptor.range.from !== undefined) ? `min="${descriptor.range.from}"` : ``
    const maxConstraint = (descriptor.range !== undefined && descriptor.range.to !== undefined) ? `max="${descriptor.range.to}"` : ``
    return `
   <div class="dform-attribute">   
    <span class="dform-attribute-caption">${descriptor.name}</span>
    <input class="dform-attribute-input-numeric" name="${descriptor.name}" 
      type="number" value="${value || ""}" ${minConstraint} ${maxConstraint}>
   </div>
  `
  }

  function extractControlValue(name, form) {
    const control = form.querySelector(`[name="${name}"`)
    if (control == null) {
      console.error(`Unable to find control for attribute "${name}"`)
      return {
        control: control,
        value: undefined
      }
    } else {
      return {
        control: control,
        value: control.value
      }
    }
  }

  function showError(name, error) {
    const control = form.querySelector(`[name="${name}"`)
    if (control == null) {
      console.error(`Unable to find control for attribute "${name}" to show error`)
    } else {
      control.classList.add("dform-attribute-input-error")
    }
  }

  function checkNullable(descriptor, value) {
    return descriptor.nullable === true || value !== ""
  }

  function extractStringValue(descriptor, form, validate) {
    const cv = extractControlValue(descriptor.name, form)
    const result = {
      success: checkNullable(descriptor, cv.value),
      value: cv.value
    }
    if (!result.success && validate) {
      cv.control.classList.add("dform-attribute-input-error")
    } else {
      cv.control.classList.remove("dform-attribute-input-error")
    }
    return result
  }

  function extractNumericValue(descriptor, form, validate) {
    const cv = extractControlValue(descriptor.name, form)
    const value = parseFloat(cv.value)
    const leftBound = descriptor.range.from == null || (descriptor.range.from <= value)
    const rightBound = descriptor.range.to == null || (descriptor.range.to >= value)
    const result = {
      success: checkNullable(descriptor, cv.value) && leftBound && rightBound,
      value: value
    }
    if (!result.success && validate) {
      cv.control.classList.add("dform-attribute-input-error")
    } else {
      cv.control.classList.remove("dform-attribute-input-error")
    }
    return result
  }

  function extractMultiValue(descriptor, form, validate) {
    const control = form.querySelector(`[name="${descriptor.name}"`)
    if (control == null) {
      console.error(`Unable to find control for attribute "${descriptor.name}"`)
      return {
        control: control,
        value: undefined
      }
    } else {
      const values = Array(...control.selectedOptions).map(option => {
        return option.value
      })
      const result = {
        success: values.find(v => !descriptor.values.includes(v)) == null
            && (descriptor.nullable === true || values.length > 0),
        value: values
      }
      if (!result.success && validate) {
        control.nextSibling.classList.add("dform-attribute-input-error")
      } else {
        control.nextSibling.classList.remove("dform-attribute-input-error")
      }
      return result
    }
  }

  function extractEnumValue(descriptor, form, validate) {
    if (descriptor.multi === true) {
      return extractMultiValue(descriptor, form, validate)
    } else {
      return extractStringValue(descriptor, form, validate)
    }
  }

  function extractRangeValue(descriptor, form, validate) {
    const cvFrom = extractControlValue(descriptor.name + "_from", form)
    const cvTo = extractControlValue(descriptor.name + "_to", form)
    const from = parseFloat(cvFrom.value)
    const to = parseFloat(cvTo.value)
    const leftBound = descriptor.range.from == null || (descriptor.range.from <= from)
    const rightBound = descriptor.range.to == null || (descriptor.range.to >= to)
    const result = {
      success: checkNullable(descriptor, cvFrom.value + cvTo.value) && leftBound && rightBound,
      value: {from: from, to: to}
    }
    if (!leftBound && validate) {
      cvFrom.control.classList.add("dform-attribute-input-error")
    } else {
      cvFrom.control.classList.remove("dform-attribute-input-error")
    }
    if (!rightBound && validate) {
      cvTo.control.classList.add("dform-attribute-input-error")
    } else {
      cvTo.control.classList.remove("dform-attribute-input-error")
    }
    return result
  }

  const generatorByType = {
    ".AttributeDescriptor$String": stringAttribute,
    ".AttributeDescriptor$Enum": enumAttribute,
    ".AttributeDescriptor$Range": rangeAttribute,
    ".AttributeDescriptor$Numeric": numericAttribute,
  }

  const valueExtractorByType = {
    ".AttributeDescriptor$String": extractStringValue,
    ".AttributeDescriptor$Enum": extractEnumValue,
    ".AttributeDescriptor$Range": extractRangeValue,
    ".AttributeDescriptor$Numeric": extractNumericValue,
  }

  const attributesHtml = schema.map((attribute) => {
    const generator = generatorByType[attribute["@c"]]
    if (generator == null) {
      console.error(`No generator for attribute of type "${attribute["@c"]}"`)
      return ``
    } else {
      return generator(attribute, (data == null) ? undefined : data[attribute.name])
    }
  }).join("\n")
  const form = document.createElement("form")
  form.classList.add("dform")
  form.innerHTML = attributesHtml
  //form.schema = schema
  const multiDropDownController = new MultiSelectDropdown({})
  multiDropDownController.initForm(form)

  this.getFormElement = function() { return form }

  this.getData = function(validate = true) {
    const data = {}
    const checks = schema.map((descriptor) => {
      const extractor = valueExtractorByType[descriptor["@c"]]
      if (extractor == null) {
        console.error(`No value extractor for attribute of type "${descriptor["@c"]}"`)
        return false
      } else {
        const result = extractor(descriptor, form, validate)
        data[descriptor.name] = result.value
        return result.success
      }
    })
    if (checks.includes(false)) return null
    else return data
  }

  this.showErrors = function(errors) {
    errors.forEach((name, error) => {
      showError(name, error)
    })
  }
}


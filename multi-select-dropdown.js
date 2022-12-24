//based on https://github.com/kiosion/js-multiselect-dropdown

function MultiSelectDropdown(params) {
  let config = {
    search: true,
    hideX: false,
    useStyles: true,
    placeholder: 'Выбрать...',
    txtSelected: 'Выбрано',
    txtAll: 'Все',
    txtRemove: 'Удалить',
    txtSearch: 'Найти...',
    minWidth: '160px',
    maxWidth: 'inherit',
    maxHeight: '180px',
    borderRadius: 0,
    ...params
  };

  const newElement = (tag, params) => {
    let element = document.createElement(tag);
    if (params) {
      Object.keys(params).forEach((key) => {
        if (key === 'class') {
          Array.isArray(params[key])
            ? params[key].forEach((o) => (o !== '' ? element.classList.add(o) : 0))
            : params[key] !== ''
            ? element.classList.add(params[key])
            : 0;
        } else if (key === 'style') {
          Object.keys(params[key]).forEach((value) => {
            element.style[value] = params[key][value];
          });
        } else if (key === 'text') {
          params[key] === '' ? (element.innerHTML = '&nbsp;') : (element.innerText = params[key]);
        } else {
          element[key] = params[key];
        }
      });
    }
    return element;
  };

  this.initForm = function (element) {
    element.querySelectorAll('select[multiple]').forEach((multiSelect) => {
      let div = newElement('div', {class: 'multiselect-dropdown'});
      multiSelect.style.display = 'none';
      multiSelect.parentNode.insertBefore(div, multiSelect.nextSibling);
      let dropdownListWrapper = newElement('div', {class: 'multiselect-dropdown-list-wrapper'});
      let dropdownList = newElement('div', {class: 'multiselect-dropdown-list'});
      let search = newElement('input', {
        class: ['multiselect-dropdown-search'].concat([config.searchInput?.class ?? 'form-control']),
        style: {
          width: '99%',
          display: config.search ? 'block' : multiSelect.attributes.search?.value === 'true' ? 'block' : 'none'
        },
        placeholder: config.txtSearch
      });
      dropdownListWrapper.appendChild(search);
      div.appendChild(dropdownListWrapper);
      dropdownListWrapper.appendChild(dropdownList);

      multiSelect.loadOptions = () => {
        dropdownList.innerHTML = '';

        if (config.selectAll || multiSelect.attributes['select-all']?.value === 'true') {
          let optionElementAll = newElement('div', {class: 'multiselect-dropdown-all-selector'});
          let optionCheckbox = newElement('input', {type: 'checkbox'});
          optionElementAll.appendChild(optionCheckbox);
          optionElementAll.appendChild(newElement('label', {text: config.txtAll}));

          optionElementAll.addEventListener('click', () => {
            optionElementAll.classList.toggle('checked');
            optionElementAll.querySelector('input').checked = !optionElementAll.querySelector('input').checked;

            let ch = optionElementAll.querySelector('input').checked;
            dropdownList.querySelectorAll(':scope > div:not(.multiselect-dropdown-all-selector)').forEach((i) => {
              if (i.style.display !== 'none') {
                i.querySelector('input').checked = ch;
                i.optEl.selected = ch;
              }
            });

            multiSelect.dispatchEvent(new Event('change'));
          });
          optionCheckbox.addEventListener('click', () => {
            optionCheckbox.checked = !optionCheckbox.checked;
          });

          dropdownList.appendChild(optionElementAll);
        }

        Array.from(multiSelect.options).map((option) => {
          let optionElement = newElement('div', {class: option.selected ? 'checked' : '', srcElement: option});
          let optionCheckbox = newElement('input', {type: 'checkbox', checked: option.selected});
          optionElement.appendChild(optionCheckbox);
          optionElement.appendChild(newElement('label', {text: option.text}));

          optionElement.addEventListener('click', () => {
            optionElement.classList.toggle('checked');
            optionElement.querySelector('input').checked = !optionElement.querySelector('input').checked;
            optionElement.srcElement.selected = !optionElement.srcElement.selected;
            multiSelect.dispatchEvent(new Event('change'));
          });
          optionCheckbox.addEventListener('click', () => {
            optionCheckbox.checked = !optionCheckbox.checked;
          });
          option.optionElement = optionElement;
          dropdownList.appendChild(optionElement);
        });
        div.dropdownListWrapper = dropdownListWrapper;

        div.refresh = () => {

          div.querySelectorAll('span.optext, span.placeholder').forEach((placeholder) => div.removeChild(placeholder));
          let selected = Array.from(multiSelect.selectedOptions);
          if (selected.length > (multiSelect.attributes['max-items']?.value ?? 5)) {
            div.appendChild(
                newElement('span', {
                  class: ['optext', 'maxselected'],
                  text: selected.length + ' ' + config.txtSelected
                })
            );
          } else {
            selected.map((option) => {
              let span = newElement('span', {
                class: 'optext',
                text: option.text,
                srcElement: option
              });
              if (!config.hideX) {
                span.appendChild(
                    newElement('span', {
                      class: 'icon-cancel',
                      title: config.txtRemove,
                      onclick: (e) => {
                        span.srcElement.optionElement.dispatchEvent(new Event('click'));
                        div.refresh();
                        e.stopPropagation();
                      }
                    })
                );
              }
              div.appendChild(span);
            });
          }
          if (multiSelect.selectedOptions?.length === 0) {
            div.appendChild(
                newElement('span', {
                  class: 'placeholder',
                  text: multiSelect.attributes?.placeholder?.value ?? config.placeholder
                })
            );
          }
        };
        div.refresh();
      };
      multiSelect.loadOptions();

      search.addEventListener('input', () => {
        dropdownList.querySelectorAll(':scope div:not(.multiselect-dropdown-all-selector)').forEach((div) => {
          let innerText = div.querySelector('label').innerText.toLowerCase();
          div.style.display = innerText.includes(search.value.toLowerCase()) ? 'flex' : 'none';
        });
      });

      div.addEventListener('click', () => {
        div.dropdownListWrapper.style.display = 'block';
        search.focus();
        search.select();
      });

      document.addEventListener('click', (e) => {
        if (!div.contains(e.target)) {
          dropdownListWrapper.style.display = 'none';
          div.refresh();
        }
      });
    });
  }
}

const data = require("./flow-os.json")

// console.log(data)

const typeMap = {
  'decimal': 'number',
  'integer': 'integer',
  'text': 'string',
  'password': 'string',
  'upload': 'string',
  'radio-buttons': 'string',
  'dropdown': 'string',
  'boolean': 'boolean',
  'date': 'string',
};

// function JSONSchema convert
const transformedData = {
  "title": data.name,
  "description": "",
  "type": "object",
  "required": [],
  "properties": {}
};
data.fields.forEach(field => {
  const { id, name, type } = field;
  const property = {
    title: name,
    type: typeMap[type]
  };

  // min-max length
  if (field.hasOwnProperty("params") && field.params.minLength) {
    property.minLength = Number.parseInt(field.params.minLength)
  } 
  if (field.hasOwnProperty("params") && field.params.maxLength) {
    property.maxLength = Number.parseInt(field.params.maxLength)
  }

  // pattern
  if (field.hasOwnProperty("params") && field.params.regexPattern) {
    property.pattern = `/^${field.params.regexPattern}$/`
  }

  // radio-button and dropdown
  if (type === 'dropdown' || type === 'radio-buttons') {
    property.enum = field.options.map(item => item.name)
  }

  // upload
  if (type === 'upload') {
    property.format = "data-url"
  }

  // date
  if (type === 'date') {
    property.format = "date"
  }

  // required form
  if (field.required) {
    transformedData.required.push(id);
  }

  transformedData.properties[id] = property;
});

console.log(JSON.stringify(transformedData));

// function UISchema convert
const uiSchema = {}
data.fields.forEach(field => {
  const { id } = field;
  const uiProperty = {}

  // placeholder
  if (field.placeholder) {
    uiProperty["ui:placeholder"] = field.placeholder
  }
  // readonly
  if (field.readOnly) {
    uiProperty["ui:readonly"] = field.readOnly
  }
  // password
  if (field.type === 'password') {
    uiProperty["ui:widget"] = 'password'
  }

  // radio-buttons
  if (field.type === 'radio-buttons'
  ) {
    uiProperty["ui:widget"] = "radio",
    uiProperty["ui:options"] = {
      "inilne": true
    }
  }

  
  uiSchema[id] = uiProperty
});

console.log(JSON.stringify(uiSchema))
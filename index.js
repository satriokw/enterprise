// console.log("welcome to USS enterprise")
const data = require("./flow-1.json")
// console.log(data)

const transformedData = {
  "title": data.metadata.name,
  "description": data.metadata.description,
  "type": "object",
  "required": [],
  "properties": {}
};

// const fields = {};

// main function JSONSchema
data.rows.forEach(row => {
  const key = row.cols[0].value.replace('{{', '').replace('}}', '');
  const colData = row.cols[0];
  const typeMap = {
    'float': 'number',
    'integer': 'integer',
    'password': 'string',
    'text': 'string',
    'upload': 'string',
    'select': 'string'
  };

  const property = {
    title: colData.label,
    type: ''
  };
  if (colData.type === 'number') {
    property.type = typeMap[colData.extraSettings.numberType]
  } else {
    property.type = typeMap[colData.type];
  }
  

  // default value
  if (colData.defaultValue) {
    if (colData.extraSettings.numberType === "float") {
      property.default = Number.parseFloat(colData.defaultValue);
    } else if (colData.extraSettings.numberType === "integer") {
      property.default = Number.parseInt(colData.defaultValue);
    } else {
      property.default = colData.defaultValue;
    }
  }

  // min-max length
  if (colData.extraSettings.minLength) {
    property.minLength = colData.extraSettings.minLength
  } 
  if (colData.extraSettings.maxLength) {
    property.maxLength = colData.extraSettings.maxLength
  }
  
  // emaili format
  if (colData.designInfo.stencilId === 'email') {
    property.format = "email"
  }
  
  // upload
  if (colData.type === 'upload') {
    property.format = "data-url"
  }
  
  // select
  if (colData.type === 'select') {
    property.enum = colData.extraSettings.items.map(item => item.value)
    property.enumNames = colData.extraSettings.items.map(item => item.text)
  }
  
  // required form
  if (row.cols[0].isRequired) {
    transformedData.required.push(key);
  }

  transformedData.properties[key] = property;
});

// console.log(transformedData);
console.log(JSON.stringify(transformedData));
// console.log(fields);

const uiSchema = {}

// main function ui schema
data.rows.forEach(row => {
  const key = row.cols[0].value.replace('{{', '').replace('}}', '');
  const colData = row.cols[0];

  const uiProperty = {}

  if (colData.description) {
    uiProperty["ui:description"] = colData.description
  }
  if (colData.placeholder) {
    uiProperty["ui:placeholder"] = colData.placeholder
  }
  if (colData.type === 'password') {
    uiProperty["ui:widget"] = 'password'
  }
  if (colData.extraSettings.acceptFileTypes) {
    uiProperty["ui:options"] = {
      accept: colData.extraSettings.acceptFileTypes
    };
  }

  uiSchema[key] = uiProperty
});

// console.log(uiSchema)
console.log(JSON.stringify(uiSchema))
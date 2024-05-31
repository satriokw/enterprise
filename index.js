// console.log("welcome to USS enterprise")
const data = require("./flow-1.json")

const TYPE_CONSTANT = {
  "text": "string",
  "number": "number",
  "password": "string",
}

// console.log(data)

// let rowId = data.rows.map((item) => item.cols[0].id)
let rowType = data.rows.map((item) => item.cols[0].type)
let rowLabel = data.rows.map((item) => item.cols[0].label)
let rowValue = data.rows.map((item) => item.cols[0].value)

let refinedValue = rowValue.map(item => item.replace('{{', '').replace('}}', ''));
// console.log(rowId)
// console.log(rowLabel)
// console.log(rowType)
// console.log(rowValue)
// console.log(refinedValue)

let type = rowType.map(item => TYPE_CONSTANT[item])

const formData = {
  type: "",
  title: "",
}

// refinedValue.forEach(item => {
//   resData.properties[item] = {};
// });

// console.log(resData);


const transformedData = {
  "title": data.metadata.name,
  "description": data.metadata.description,
  "type": "object",
  "required": [],
  "properties": {}
};

const fields = {};

data.rows.forEach(row => {
  const key = row.cols[0].value.replace('{{', '').replace('}}', '');
  const colData = row.cols[0];
  const typeMap = {
    'float': 'number',
    'integer': 'integer',
    'password': 'string',
    'text': 'string'
  };

  const property = {
    title: colData.label,
    type: type
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

  // required form
  if (row.cols[0].isRequired) {
    transformedData.required.push(key);
  }

  transformedData.properties[key] = property;
});

console.log(transformedData);
// console.log(fields);
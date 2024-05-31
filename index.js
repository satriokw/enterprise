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

const resData = {
  title: "A registration form",
  description: "A simple form example.",
  type: "object",
  properties: {}
}

const formData = {
  type: "",
  title: "",
}

refinedValue.forEach(item => {
  resData.properties[item] = {};
});

// console.log(resData);


const transformedData = {
  "title": data.metadata.name,
  "description": data.metadata.description,
  "type": "object",
  "properties": {}
};

data.rows.forEach(row => {
  const key = row.cols[0].value.replace('{{', '').replace('}}', '');
  transformedData[key] = row.cols[0];
});

console.log(transformedData);
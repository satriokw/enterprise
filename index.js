// console.log("welcome to USS enterprise")
// import data from "./flow-1.json"
import data from "./flow-1.json" assert {type: "json"}
import TYPE_CONSTANT from "./constant.js"

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

let hehe = rowType.map(item => TYPE_CONSTANT[item])
console.log(hehe)

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
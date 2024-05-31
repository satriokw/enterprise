// console.log("welcome to USS enterprise")
// import data from "./flow-1.json"
const data = require("./flow-1.json")

// console.log(data)

let rowId = data.rows.map((item) => item.cols[0].id)
let rowLabel = data.rows.map((item) => item.cols[0].label)
let rowValue = data.rows.map((item) => item.cols[0].value)

let refinedValue = rowValue.map(item => item.replace('{{', '').replace('}}', ''));
console.log(rowId)
console.log(rowLabel)
console.log(rowValue)
console.log(refinedValue)
// console.log(Array.isArray(data.rows))
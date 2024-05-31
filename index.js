// console.log("welcome to USS enterprise")
// import data from "./flow-1.json"
const data = require("./flow-1.json")

// console.log(data)

let row = data.rows.map((item) => item.cols)

console.log(row)
// console.log(Array.isArray(data.rows))
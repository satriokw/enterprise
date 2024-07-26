// const data = require("./2-biz-form-input-data");
const { default: axios } = require("axios");
const data = require("./form-exp.json");
const fs = require("node:fs");

// console.log(data)

const typeMap = {
  decimal: "number",
  integer: "number",
  text: "textfield",
  "radio-buttons": "radio",
  dropdown: "select",
  date: "datetime",
  boolean: "checklist",
  headline: "text",
};

const transformedData = {
  id: data.id,
  type: "default",
  schemaVersion: data.version,
  exporter: {
    name: "form-js (https://demo.bpmn.io)",
    version: "1.8.3",
  },
  components: [],
};

async function processFields(fields) {
  for (const field of fields) {
    const { id, name, type } = field;

    const property = {
      label: "",
      type: "",
      id: "",
      key: "",
      readonly: false,
      layout: {
        row: "",
        columns: null,
      },

      title: "",
      type: "",
    };

    if (type in typeMap) {
      property.id = id;
      property.key = type + "_" + id;
      property.label = name;
      property.type = typeMap[type];

      if (field.type === "date") {
        property.dateLabel = field.name;
        property.subtype = "date";
      }

      if (field.type === "boolean") {
        property.values = [{ label: "yes", value: true }];
      }

      if (field.hasOwnProperty("value") && field.value !== null) {
        property.defaultValue = field.value;
      }
      if (field.hasOwnProperty("options")) {
        property.values = field.options.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      }

      if (field.required) {
        property.validate = {
          required: true,
        };
      }
      transformedData.components.push(property);
    } else {
      if (field.fieldType === "ExpressionFormField") {
        let temp = cleanAndParseJson(JSON.stringify(field.value));
        property.label = temp.label;
        property.key = type + "_" + temp.id;
        property.id = temp.id;
        property["type"] = "select";
        try {
          let fetchDataResult = await fetchData(temp.value);
          property.values = fetchDataResult.map((item) => ({
            label: item,
            value: item,
          }));
        } catch (error) {
          console.error("Error fetching data:", error);
          property.values = []; // Handle error case appropriately
        }
        transformedData.components.push(property);
      }
    }
  }
}

async function fetchData(val) {
  try {
    let response = await axios.get(val);
    return response.data.data.map((item) => item.name);
  } catch (error) {
    console.error("Error fetching data:", error);
    return []; // or handle error case as needed
  }
}

function cleanAndParseJson(jsonString) {
  let cleanedJson = jsonString
    .replace(/\\n/g, "")
    .replace(/\'\'/g, "")
    .replace(/@/g, "")
    .replace(/script=\\"json\\";data=/g, "");

  let parsedJson = JSON.parse(JSON.parse(cleanedJson));

  return parsedJson;
}

// Assuming `data.fields` is your input array
processFields(data.fields)
  .then(() => {
    // console.log(transformedData); // Print the transformed data once all processing is done
    fs.writeFile(
      "/Users/koinworks/labs/sandbox/enterprise/output-bpmn.json",
      JSON.stringify(transformedData),
      (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log("success");
        }
      }
    );
  })
  .catch((error) => {
    console.error("Error processing fields:", error);
  });

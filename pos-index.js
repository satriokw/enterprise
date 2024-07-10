// const data = require("./2-biz-form-input-data");
const { default: axios } = require("axios");
const data = require("./form-exp.json");
const fs = require("node:fs");

// console.log(data)

const typeMap = {
  decimal: "number",
  integer: "integer",
  text: "string",
  password: "string",
  upload: "string",
  "radio-buttons": "string",
  dropdown: "string",
  boolean: "boolean",
  date: "string",
};

const expressionTypeMap = {
  dd: "string",
};

const transformedData = {
  title: data.name,
  description: "",
  type: "object",
  required: [],
  properties: {},
};

async function processFields(fields) {
  for (const field of fields) {
    const { id, name, type } = field;

    const property = {
      title: "",
      type: "",
    };

    if (type in typeMap) {
      property.title = name;
      property.type = typeMap[type];

      if (field.hasOwnProperty("params") && field.params.minLength) {
        property.minLength = Number.parseInt(field.params.minLength);
      }
      if (field.hasOwnProperty("params") && field.params.maxLength) {
        property.maxLength = Number.parseInt(field.params.maxLength);
      }

      if (
        field.id.toLowerCase().includes("email") ||
        field.name.toLowerCase().includes("email")
      ) {
        property.format = "email";
      }

      if (field.hasOwnProperty("params") && field.params.regexPattern) {
        property.pattern = `/^${field.params.regexPattern}$/`;
      }

      if (type === "dropdown" || type === "radio-buttons") {
        property.enum = field.options.map((item) => item.name);
      }

      if (type === "upload") {
        property.format = "data-url";
      }

      if (type === "date") {
        property.format = "date";
      }

      if (field.hasOwnProperty("value") && field.value !== null) {
        property.default = field.value;
      }
      if (
        field.type === "boolean" &&
        field.hasOwnProperty("value") &&
        field.value === null
      ) {
        property.default = false;
      }
      transformedData.properties[id] = property;
    } else {
      if (field.fieldType === "ExpressionFormField") {
        let hoho = cleanAndParseJson(JSON.stringify(field.value));
        let epxId = hoho.id;
        property["title"] = hoho.label;
        property["type"] = expressionTypeMap[hoho.type];
        try {
          let fetchDataResult = await fetchData(hoho.value);
          property.enum = fetchDataResult;
        } catch (error) {
          console.error("Error fetching data:", error);
          property.enum = []; // Handle error case appropriately
        }
        transformedData.properties[epxId] = property;
      }
    }
    if (field.required) {
      transformedData.required.push(id);
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
    console.log(transformedData); // Print the transformed data once all processing is done
  })
  .catch((error) => {
    console.error("Error processing fields:", error);
  });

// console.log(transformedData); // print json on terminal (easier to read)
// console.log(JSON.stringify(transformedData));  // print string JSON format to paste on playground

// function UISchema convert
const uiSchema = {};
data.fields.forEach((field) => {
  const { id } = field;

  // if the type is not on the typeMap, it will skip it.
  if (field.type in typeMap) {
    const uiProperty = {};

    // placeholder
    if (field.placeholder) {
      uiProperty["ui:placeholder"] = field.placeholder;
    }
    // readonly
    if (field.readOnly) {
      uiProperty["ui:readonly"] = field.readOnly;
    }
    // password
    if (field.type === "password") {
      uiProperty["ui:widget"] = "password";
    }

    // radio-buttons
    if (field.type === "radio-buttons") {
      (uiProperty["ui:widget"] = "radio"),
        (uiProperty["ui:options"] = {
          inilne: true,
        });
    }

    uiSchema[id] = uiProperty;
  }
});

console.log(uiSchema); // print json on terminal (easier to read)
// console.log(JSON.stringify(uiSchema))  // print string JSON format to paste on playground

// write to file
// fs.writeFile(
//   "/Users/koinworks/labs/sandbox/enterprise/output.json",
//   JSON.stringify(transformedData),
//   (err) => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log("success");
//     }
//   }
// );
// fs.writeFile(
//   "/Users/koinworks/labs/sandbox/enterprise/output-ui.json",
//   JSON.stringify(uiSchema),
//   (err) => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log("success");
//     }
//   }
// );

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

// function JSONSchema convert
const transformedData = {
  title: data.name,
  description: "",
  type: "object",
  required: [],
  properties: {},
};
data.fields.forEach((field) => {
  const { id, name, type } = field;

  const property = {
    title: name,
    type: typeMap[type],
  };

  // if the type is not on the typeMap, it will skip it.
  if (type in typeMap) {
    property["type"] = typeMap[type];

    // min-max length
    if (field.hasOwnProperty("params") && field.params.minLength) {
      property.minLength = Number.parseInt(field.params.minLength);
    }
    if (field.hasOwnProperty("params") && field.params.maxLength) {
      property.maxLength = Number.parseInt(field.params.maxLength);
    }

    // Check if either the id or the name contains the string "email" to format email
    if (
      field.id.toLowerCase().includes("email") ||
      field.name.toLowerCase().includes("email")
    ) {
      // Set the variable property_format to "email"
      property.format = "email";
    }

    // pattern
    if (field.hasOwnProperty("params") && field.params.regexPattern) {
      property.pattern = `/^${field.params.regexPattern}$/`;
    }

    // radio-button and dropdown
    if (type === "dropdown" || type === "radio-buttons") {
      property.enum = field.options.map((item) => item.name);
    }

    // upload
    if (type === "upload") {
      property.format = "data-url";
    }

    // date
    if (type === "date") {
      property.format = "date";
    }

    // default value
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

    // required form
    if (field.required) {
      transformedData.required.push(id);
    }
  } else {
    if (field.fieldType === "ExpressionFormField") {
      property["type"] = expressionTypeMap[field.fieldType];

      let hoho = cleanAndParseJson(JSON.stringify(field.value));

      let fetchData = async (val) => {
        try {
          // Use await to wait for the axios GET request to complete
          let response = await axios.get(val);
          // Access the response data directly
          return response.data.data.map((item) => item.name);
        } catch (error) {
          // Handle any errors that occur during the request
          console.error("Error fetching data:", error);
          return []; // or handle error case as needed
        }
      };

      fetchData(hoho.value)
        .then((res) => {
          property.enum = res;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }
  // required form
  if (field.required) {
    transformedData.required.push(id);
  }
  transformedData.properties[id] = property;
});

function cleanAndParseJson(jsonString) {
  // Remove \n characters from the string
  cleanedJson = jsonString
    .replace(/\\n/g, "")
    .replace(/\'\'/g, "")
    .replace(/@/g, "")
    .replace(/script=\\"json\\";data=/g, "");

  let parsedJson = JSON.parse(JSON.parse(cleanedJson));

  // Parse the cleaned JSON string into a JavaScript object
  try {
    return parsedJson;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
}

console.log(transformedData); // print json on terminal (easier to read)
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

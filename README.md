# Adaptor Flowable form - React JSONSchema Form (RJSF)

## items:
1. Flowable enterprise to RJSF format
2. Flowable OSS to RJSF format

## how to use enterprise:
- install dependencies: run `npm install`
- download flowable form file (.form) and move to the repo
- rename the flowable form file to `form-testForm.form`
- run 
  ```sh
  node index.js
  ```

### dependencies
- dayjs: to handle date-string formatting


## how to use OSS:
- get the form model from the API 
  > `{URL}/flowable-rest/form-api/form-repository/form-definitions/{FORM_UUID}/model`
- copy and paste the response from the API to file: `flow-os.json` *(replace the file if needed)*
- run 
  ```sh
  node os-index.js
  ```

## progress
- [x] adaptor flowable form to rjsf format
  - [x] text input, number input
  - [x] password input, email input
  - [x] input select, radio, checkbox, switch
  - [x] input date
  - [x] input file

- [ ] adaptor rjsf format to flowable form

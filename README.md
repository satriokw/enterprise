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
- copy and paste the response from the API to file: `flow-os.json` _(replace the file if needed)_
- run
  ```sh
  node os-index.js
  ```

## progress

- [x] adaptor FLOWABLE-Enterprise form to rjsf format

  - [x] text input, number input
  - [x] password input, email input
  - [x] input select, radio, checkbox, switch
  - [x] input date
  - [x] input file

- [x] adaptor FLOWABLE-OSS form to rjsf format

  - [x] string (normal)
  - [x] password (string)
  - [x] integer
  - [x] decimal
  - [x] checkbox
  - [x] date
  - [x] dropdown
  - [x] radio buttons
  - [x] upload

- [ ] adaptor rjsf format to flowable form

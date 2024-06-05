# Adaptor Flowable form - React JSONSchema Form (RJSF)

## how to use:
- install dependencies: run `npm install`
- download flowable form file (.form) and move to the repo
- rename the flowable form file to `form-testForm.form`
- run 
  ```sh
  node index.js
  ```

### dependencies
- dayjs: to handle date-string formatting

### progress
- [x] adaptor flowable form to rjsf format
  - [x] text input, number input
  - [x] password input, email input
  - [x] input select, radio, checkbox, switch
  - [x] input date
  - [x] input file

- [ ] adaptor rjsf format to flowable form

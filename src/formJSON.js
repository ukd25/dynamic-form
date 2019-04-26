export const FORM_JSON = [
  {
    // Input
    type: "string",
    widget: "input",
    initialValue: null,
    placeholder: "First Name",
    key: "firstName"
  },
  {
    // Input
    type: "string",
    widget: "input",
    initialValue: null,
    placeholder: "Last Name",
    key: "lastName",
    validationRegex: /^u/
  },
  {
    // Radio
    type: "string",
    widget: "radio",
    initialValue: null,
    placeholder: "Select your gender",
    key: "gender",
    required: true,
    options: ["Male", "Female"]
  },
  {
    // Checkbox
    type: "boolean",
    widget: "checkbox",
    initialValue: false,
    placeholder: "Are you married?",
    key: "marriedStatus"
  },
  {
    // Email
    type: "email",
    widget: "input",
    initialValue: null,
    placeholder: "Email",
    key: "email",
    dependency: [
      {
        type: "hidden",
        field: "lastName",
        value: "ujjwal"
      }
    ]
  },
  {
    // Number
    type: "number",
    widget: "input",
    initialValue: null,
    placeholder: "Age",
    key: "age"
  },
  {
    // Single Select (values from list)
    type: "string",
    widget: "dropdown",
    initialValue: null,
    placeholder: "Languages you speak",
    values: ["English", "Hindi", "Telugu", "Tamil"],
    key: "speakingLanguages"
  },
  {
    // Single Select (values from API)
    type: "string",
    widget: "dropdown",
    initialValue: null,
    placeholder: "Select your region",
    api: "https://restcountries.eu/rest/v2/region/asia",
    key: "region",
    dependency: [
      {
        type: "filter",
        field: "firstName"
      }
    ]
  },
  // {
  //   // Multiple Select
  //   type: "string",
  //   widget: "input",
  //   initialValue: "",
  //   placeholder: "Name"
  // },
  {
    // TextArea
    type: "string",
    widget: "textarea",
    initialValue: null,
    placeholder: "Comments",
    key: "comments"
  }
];

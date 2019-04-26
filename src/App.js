import React from "react";
import { Input, Select, Form, Radio, Checkbox, Button, message, AutoComplete } from "antd";
import { FORM_JSON } from "./formJSON";
import Axios from "axios";

const TextArea = Input.TextArea;
const Option = Select.Option;
const FormItem = Form.Item;
const EMPTY_ARRAY = [];
const formStyle = {
  width: '800px',
  border: '5px solid #607d8b',
  margin:'auto',
  padding: '3rem 4rem 2rem 4rem',
  backgroundColor:'#eceff1',
  'border-radius': '5px'
};

class App extends React.Component {
  state = {
    dropdownValues: {}
  };

  componentDidMount() {
    FORM_JSON.forEach(field => {
      if (field.widget === "dropdown" && field.api) {
        Axios({
          method: "GET",
          url: field.api
        }).then(response => {
          const values = response.data.map(item => item.name);
          this.setState(state => ({
            dropdownValues: {
              ...state.dropdownValues,
              [field.key]: values
            }
          }));
        });
      }
    });
  }

  hasFilterDependeny = field => {
    const isDropdownField = field.widget === "dropdown";
    const hasDependency = field.dependency && field.dependency.length;
    const filterDependency =
      hasDependency && field.dependency.find(dep => dep.type === "filter");
    if (isDropdownField && filterDependency) {
      const { getFieldValue } = this.props.form;
      const sourceFieldValue = getFieldValue(filterDependency.field);
      if (sourceFieldValue) {
        return this.getDropdownOptions(field).filter(item =>
          item.toLowerCase().includes(sourceFieldValue)
        );
      }
    }
    return this.getDropdownOptions(field);
  };

  hasHiddenDependency = field => {
    const hasDependency = field.dependency && field.dependency.length;
    const hiddenDependency =
      hasDependency && field.dependency.find(dep => dep.type === "hidden");
    if (hiddenDependency) {
      const { getFieldValue } = this.props.form;
      const sourceFieldValue = getFieldValue(hiddenDependency.field);

      if (sourceFieldValue) {
        return !(sourceFieldValue === hiddenDependency.value);
      }
    }

    return true;
  };

  // Wrapper to club mulitple dependecies
  getDependentDropdownValue = field => {
    return this.hasFilterDependeny(field);
  };

  isDependentFieldVisible = field => {
    return this.hasHiddenDependency(field);
  };

  submitFieldValue = key => e => {
    if (!e) {
      return;
    }

    const { value } = e.target;

    if (value === undefined || value === null || value === "") {
      return;
    }

    return Axios({
      method: "POST",
      url: "https://enmzq6eaj9rj.x.pipedream.net/response/submit/?name=ujjwal",
      data: {
        [key]: value
      }
    }).then(repsonse => {
      message.success("Value submitted");
    });
  };

  getComponent = field => {
    const { widget } = field;
    switch (widget) {
      case "input":
        return (
          <Input
            onBlur={this.submitFieldValue(field.key)}
            type={this.getInputFieldType(field)}
            placeholder={field.placeholder}
          />
        );
      case "dropdown":
        return (
          <Select
            placeholder={field.placeholder}
            onBlur={this.submitFieldValue(field.key)}
          >
            <Option value={null}>Select a value</Option>
            {this.getDependentDropdownValue(field).map(item => (
              <Option value={item}>{item}</Option>
            ))}
          </Select>
        );
      case "radio":
        return (
          <Radio.Group
            placeholder={field.placeholder}
            onBlur={this.submitFieldValue(field.key)}
          >
            {field.options.map(item => (
              <Radio value={item}>{item}</Radio>
            ))}
          </Radio.Group>
        );
      case "checkbox":
        return (
          <Checkbox onBlur={this.submitFieldValue(field.key)}>
            {field.placeholder}
          </Checkbox>
        );
      case "textarea":
        return (
          <TextArea
            onBlur={this.submitFieldValue(field.key)}
            placeholder={field.placeholder}
          />
        );
      default:
        return null;
    }
  };

  getDropdownOptions = field => {
    if (field.values) {
      return field.values;
    }

    const values = this.state.dropdownValues[field.key];

    return values || EMPTY_ARRAY;
  };

  getValidationRules = field => {
    const rules = [];
    if (field.required) {
      rules.push({
        required: true,
        message: "This is required"
      });
    }
    if (field.type === "email") {
      rules.push({
        type: "email",
        message: "Please enter a valid value"
      });
    }
    if (field.validationRegex) {
      rules.push({
        validator: this.validateField(field)
      });
    }
    return rules;
  };

  validateField = ({ validationRegex }) => {
    return (rule, value, callback) => {
      if (value && validationRegex.test(value)) {
        callback();
      }
      callback("Please enter a valid value");
    };
  };

  getFormWrappedField = field => {
    const { getFieldDecorator } = this.props.form;
    const FieldComponent = this.getComponent(field);
    if (FieldComponent) {
      if (!this.isDependentFieldVisible(field)) {
        return null;
      }
      return (
        <FormItem>
          {getFieldDecorator(field.key, {
            initialValue: field.initialValue,
            rules: this.getValidationRules(field)
          })(this.getComponent(field))}
        </FormItem>
      );
    }
    return null;
  };

  getInputFieldType = ({ type }) => {
    switch (type) {
      case "string":
        return "text";
      case "number":
        return "number";
      case "email":
        return "email";
      default:
        return "text";
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };

  render() {
    return (
      <Form style={formStyle} onSubmit={this.handleSubmit}>
        {FORM_JSON.map(this.getFormWrappedField)}
        <FormItem>
          <Button htmlType="submit" type="primary">
            Submit
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedApp = Form.create()(App);

export default WrappedApp;
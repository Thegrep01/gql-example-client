import { Form, Input, Button } from "antd";
import React from "react";
import "./Register.css";
function Register(props: any) {
  const { getFieldDecorator } = props.form;

  const compareToFirstPassword = (_: any, value: any, callback: any) => {
    const { form } = props;
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    props.form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };

  return (
    <div className="wrapper">
      <Form onSubmit={handleSubmit}>
        <Form.Item label="Login">
          {getFieldDecorator("login", {
            rules: [
              {
                required: true,
                message: "Please input your login!"
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Password" hasFeedback>
          {getFieldDecorator("password", {
            rules: [
              {
                required: true,
                message: "Please input your password!"
              }
            ]
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item label="Confirm Password" hasFeedback>
          {getFieldDecorator("confirm", {
            rules: [
              {
                required: true,
                message: "Please confirm your password!"
              },
              { validator: compareToFirstPassword }
            ]
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export const RegisterForm = Form.create({ name: "register" })(Register);

import { Form, Input, Button, notification } from "antd";
import React, { useEffect } from "react";
import "./Register.css";
import { useMutation } from "@apollo/react-hooks";
import { SIGN_UP } from "../../graphql/mutations/auth.mutations";
import { useHistory } from "react-router-dom";

function Register(props: any) {
  const { getFieldDecorator } = props.form;
  const [signUp, { data }] = useMutation(SIGN_UP);
  const history = useHistory();

  const getRecord = (data: any) => {
    const {
      auth: {
        signUp: { record }
      }
    } = data;
    return record;
  };

  useEffect(() => {
    if (data) {
      const record = getRecord(data);
      if (record) {
        localStorage.setItem("token", record.accessToken);
        history.replace("/");
      } else {
        notification.error({
          message: "Such user exists",
          description: "Change your login"
        });
      }
    }
  }, [data]);

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
        signUp({
          variables: { login: values.login, password: values.password }
        });
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

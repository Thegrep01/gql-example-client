import React, { useEffect } from "react";
import { Form, Icon, Input, Button, notification } from "antd";
import "./Login.css";
import { Link, useHistory } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { SIGN_IN } from "../../graphql/mutations/auth.mutations";
function Login(props: any) {
  const { getFieldDecorator } = props.form;
  const [signIn, { data }] = useMutation(SIGN_IN);
  const history = useHistory();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    props.form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        signIn({
          variables: { login: values.login, password: values.password }
        });
        console.log("Received values of form: ", values);
      }
    });
  };

  const getRecord = (data: any) => {
    const {
      auth: {
        signIn: { record }
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
          message: "Wrong password"
        });
      }
    }
  }, [data]);

  return (
    <div className="wrapper">
      <Form className="login-form" onSubmit={handleSubmit}>
        <Form.Item>
          {getFieldDecorator("login", {
            rules: [{ required: true, message: "Please input your login!" }]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Login"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "Please input your Password!" }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="Password"
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
          Or <Link to="/register">register now!</Link>
        </Form.Item>
      </Form>
    </div>
  );
}

export const LoginForm = Form.create({ name: "login" })(Login);

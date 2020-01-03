import React, { useEffect } from "react";
import { Table } from "antd";
import { Input } from "antd";
import "./Main.css";
import { useQuery } from "@apollo/react-hooks";
import { GET_JOKES } from "../../graphql/queries/jokes.queries";

const { Search } = Input;
export function Main() {
  const columns = [
    {
      title: "Joke",
      dataIndex: "joke",
      key: "joke"
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author"
    }
  ];

  const dataM = [
    {
      key: "1",
      joke: "John Brown",
      author: 32
    },
    {
      key: "2",
      joke: "Jim Green",
      author: 42
    },
    {
      key: "3",
      joke: "Joe Black",
      author: 32
    }
  ];

  const { loading, data } = useQuery(GET_JOKES);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      <Search
        className="search-input pd"
        placeholder="add joke"
        enterButton="Add"
        size="large"
        onSearch={value => console.log(value)}
      />
      <Table
        className="padding-h"
        columns={columns}
        dataSource={dataM}
        loading={loading}
      />
    </>
  );
}

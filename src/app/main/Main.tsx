import React, { useEffect, useState } from "react";
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

  const { loading, data } = useQuery(GET_JOKES);
  const [dataForRender, setDataForRender] = useState();

  useEffect(() => {
    if (data) {
      setDataForRender(
        data.allJokes.map((item: any) => ({
          key: item.id,
          joke: item.joke,
          author: item.author.login
        }))
      );
    }
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
        dataSource={dataForRender}
        loading={loading}
      />
    </>
  );
}

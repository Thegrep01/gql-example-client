import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { Input } from "antd";
import "./Main.css";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_JOKES } from "../../graphql/queries/jokes.queries";
import { ADD_JOKE } from "../../graphql/mutations/jokes.mutations";

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
  const [joke, setJoke] = useState();
  const [addJoke, { loading: mutationLoading }] = useMutation(ADD_JOKE, {
    update(cache, { data: { jokes } }) {
      const {
        createJoke: { record }
      } = jokes;

      const { allJokes }: any = cache.readQuery({ query: GET_JOKES });
      console.log(allJokes);
      cache.writeQuery({
        query: GET_JOKES,
        data: { allJokes: allJokes ? [record, ...allJokes] : [record] }
      });
    }
  });

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

  const handleSubmit = (value: string) => {
    addJoke({ variables: { joke: value } });
    setJoke("");
  };

  return (
    <>
      <Search
        className="search-input pd"
        placeholder="add joke"
        enterButton="Add"
        size="large"
        value={joke}
        onChange={e => setJoke(e.target.value)}
        loading={mutationLoading}
        onSearch={handleSubmit}
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

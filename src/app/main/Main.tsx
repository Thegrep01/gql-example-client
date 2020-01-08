import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { Input } from "antd";
import "./Main.css";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
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
  const perPage = 2;
  const [getJokes, { loading, data }] = useLazyQuery(GET_JOKES, {
    variables: { perPage, page: 1 }
  });
  const [dataForRender, setDataForRender] = useState();
  const [joke, setJoke] = useState();
  const [paginationInfo, setPaginationInfo] = useState();
  const [currPage, setCurrPage] = useState(1);

  // ***** ПРОСТО КАК ПРИМЕР С ПАГИНАЦЕЙ НОРМАЛЬНО НЕ РАБОТАЕТ *****
  // const [addJoke, { loading: mutationLoading }] = useMutation(ADD_JOKE, {
  //  update делается для того чтобы не тянуть данные с сервера после создания а обновить из в кэше
  //   update(cache, { data: { jokes } }) {
  //     const {
  //       createJoke: { record }
  //     } = jokes;
  //     const { allJokes }: any = cache.readQuery({
  //       query: GET_JOKES,
  //       variables: { page: 1, perPage }
  //     });
  //     console.log(allJokes);
  //     cache.writeQuery({
  //       query: GET_JOKES,
  //       variables: {
  //         perPage: 2,
  //         page: 1
  //       },
  //       data: {
  //         allJokes: allJokes
  //           ? { ...allJokes, items: [record, ...allJokes.items] }
  //           : { ...allJokes, items: [record] }
  //       }
  //     });
  //   }
  // });
  const [addJoke, { loading: mutationLoading }] = useMutation(ADD_JOKE, {
    refetchQueries: [
      {
        query: GET_JOKES,
        variables: { perPage, page: currPage }
      }
    ]
  });

  useEffect(() => {
    getJokes();
  }, []);

  useEffect(() => {
    if (data) {
      setDataForRender(
        data.allJokes.items.map((item: any) => ({
          key: item.id,
          joke: item.joke,
          author: item.author.login
        }))
      );
      setPaginationInfo({
        pageSize: data.allJokes.pageInfo.perPage,
        total: data.allJokes.pageInfo.totalItems
      });
    }
  }, [data]);

  const handleSubmit = (value: string) => {
    try {
      addJoke({ variables: { joke: value } });
      setJoke("");
    } catch (e) {
      console.log(e);
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrPage(page);
    getJokes({ variables: { perPage: pageSize, page } });
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
        pagination={{ ...paginationInfo, onChange: handlePageChange }}
      />
    </>
  );
}

import { useState } from "react";
import styles from "./App.module.css";
import { useEffect } from "react";
import { ToDo } from "./components/ToDo";

export const App = () => {
  const [toDos, setToDos] = useState([]);
  const [addToDo, setAddToDo] = useState("");
  const [refrestToDoListFlag, setRefrestToDoListFlag] = useState(false);
  const [toSort, setToSort] = useState([]);
  const [isSorted, setIsSorted] = useState(false); //Флаг
  const [toFind, setToFind] = useState([]);
  const [findToDo, setFindToDo] = useState([]);
  const [isFind, setIsFind] = useState(false); //Флаг
  const [chosenList, setChosenList] = useState(toDos);

  const refreshToDoList = () => {
    setRefrestToDoListFlag(!refrestToDoListFlag);
  };
  const refreshIsSorted = () => {
    // Изменить состояния флага для сортировки
    setIsSorted(!isSorted);
  };

  const refrestIsFind = () => {
    // Изменить состояния флага для поиска
    setIsFind(!isFind);
  };

  // const choseList = () => {
  //   if (isFind) {
  //     setChosenList(toFind);
  //   }
  //   if (isSorted) {
  //     setChosenList(toSort);
  //   }
  //   console.log(chosenList);
  // };

  useEffect(() => {
    fetch("http://localhost:3005/posts")
      .then((response) => response.json())
      .then((loadedToDos) => {
        setToDos(loadedToDos);
      });
  }, [refrestToDoListFlag]);

  useEffect(() => {
    fetch("http://localhost:3005/posts") // Сортировка
      .then((response) => response.json())
      .then((loadedSortToDos) => {
        setToSort(
          loadedSortToDos.sort((x, y) => x.title.localeCompare(y.title))
        );
      });
  }, [refrestToDoListFlag]);

  const requestAddNewToDo = () => {
    fetch("http://localhost:3005/posts", {
      method: "POST",
      header: { "Content-Type": "application/json;charset=utf-8" },
      body: JSON.stringify({
        title: addToDo,
      }),
    })
      .then((rawResponse) => rawResponse.json())
      .then((response) => {
        console.log(response);
        setAddToDo("");
        refreshToDoList();
      });
  };

  const requestDeleteToDo = (id) => {
    fetch(`http://localhost:3005/posts/${id}`, {
      method: "DELETE",
    })
      .then((rawResponse) => rawResponse.json())
      .then((response) => {
        console.log(response);
        refreshToDoList();
      });
  };

  const onClickDelete = (id) => {
    requestDeleteToDo(id);
  };

  const onChange = ({ target }) => {
    setAddToDo(target.value);
  };

  const onChangeFind = ({ target }) => {
    setFindToDo(target.value);
  };

  const find = () => {
    refrestIsFind();
    const newFindArr = [];
    toDos.forEach((item) => {
      if (item.title.toLowerCase().includes(findToDo.toLowerCase())) {
        newFindArr.push(item);
      }
    });
    setToFind(newFindArr);
    setFindToDo("");
    refreshToDoList();
  };

  return (
    <div className={styles.containerToDos}>
      <h1>TODO LIST</h1>
      <div className={styles.inputField}>
        <input
          className={styles.input}
          type="text"
          name="inputAddToDo"
          value={addToDo}
          onChange={onChange}
        />
        <button
          className={styles.button}
          onClick={requestAddNewToDo}
          type="submit"
        >
          Добавить
        </button>
      </div>
      <button
        hidden={!isFind}
        className={styles.cancelButton}
        onClick={() => {
          find();
        }}
        type="submit"
      >
        Отменить поиск
      </button>
      {!isSorted &&
        !isFind &&
        toDos.map(({ id, title }) => (
          <ToDo
            id={id}
            title={title}
            onClickDelete={onClickDelete}
            rerefrestToDoList={refreshToDoList}
            key={id}
          />
        ))}
      {isSorted &&
        !isFind &&
        toSort.map(({ id, title }) => (
          <ToDo
            id={id}
            title={title}
            onClickDelete={onClickDelete}
            rerefrestToDoList={refreshToDoList}
            key={id}
          />
        ))}
      {isFind &&
        toFind.map(({ id, title }) => (
          <ToDo
            id={id}
            title={title}
            onClickDelete={onClickDelete}
            rerefrestToDoList={refreshToDoList}
            key={id}
          />
        ))}
      <button
        hidden={isFind}
        className={isSorted ? styles.sortButtonClicked : styles.sortButton}
        onClick={refreshIsSorted}
        type="submit"
      >
        Сортировать по алфавиту
      </button>
      <input
        hidden={isFind}
        className={styles.input}
        type="text"
        name="inputAddToDo"
        value={findToDo}
        onChange={onChangeFind}
      />
      <button
        hidden={isFind}
        className={styles.findButton}
        onClick={() => {
          find();
        }}
        type="submit"
      >
        Поиск
      </button>
    </div>
  );
};

export default App;

import React, { useState } from 'react';
import styles from '../styles/ToDo.module.css'


export const ToDo=({id,title,onClickDelete,rerefrestToDoList})=>{
 const[isHidden, setIsHidden]=useState(false);
 const[updateToDoValue, setUpdateToDoValue]=useState(title)

 const requestUpdateToDo = (id) => {  
  fetch(`http://localhost:3005/posts/${id}`, {
    method: "PUT",
    header: { "Content-Type": "application/json;charset=utf-8" },
    body: JSON.stringify({
      title: updateToDoValue,
    }),
    })
    .then((rawResponse) => rawResponse.json())
    .then((response) => {
      console.log(response);
      rerefrestToDoList();
      setIsHidden(!isHidden);
    });
  };

    const onChange = ({ target }) => {
      setUpdateToDoValue(target.value);
    };

    const onClickUpdate = () => {
      setIsHidden(!isHidden);
    };

    const confirmUpdate=()=>{
      requestUpdateToDo(id)
    }

    return(
    <div className={styles.todo}>
        {isHidden ? <><input
          className={styles.input}
          type="text"
          name="inputUpdateToDo"
          defaultValue={updateToDoValue}
          onChange={onChange}
        />
        <div className={styles.buttonCcontainer}> 
          <button
          className={styles.button}
          type="sumbit"
          onClick={()=>{confirmUpdate(id)}}
        >
          Сохранить
        </button>
        <button
          className={styles.button}
          type="sumbit"
          onClick={()=>{onClickUpdate()}}
        >
          Отмена
        </button>
        </div>
        
        </>
        :<>{title} 
        <div className={styles.buttonCcontainer}>       
        <button
          className={styles.button}
          type="sumbit"
          onClick={()=>{onClickUpdate()}}
        >
          Изменить
        </button>
        <button
          className={styles.button}
          type="sumbit"
          onClick={()=>{onClickDelete(id)}}
        >
          Удалить
        </button>
        </div>
        </>}
        </div>
        )
}
import React from 'react';
import './ListData.css';

export default function ListData({ data, del, edit }) {
  return (
    <li className={data.type === '+' ? 'green' : 'red'}>
      <div className="idCode">
        <strong>{data.day}</strong>
      </div>
      <div className="info">
        <div className="title">
          <strong>{data.category}</strong>
        </div>
        <span>{data.description}</span>
      </div>
      <div className="value">
        <strong>R$ {data.value}</strong>
      </div>
      <div className="acoes">
        <button onClick={() => edit(data)}>
          <i className="material-icons">edit</i>
        </button>
        <button onClick={() => del(data._id)}>
          <i className="material-icons">delete</i>
        </button>
      </div>
    </li>
  );
}

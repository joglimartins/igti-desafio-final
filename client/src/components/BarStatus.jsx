import React from 'react';
import './BarStatus.css';

export default function BarStatus({ data }) {
  const receita = data.reduce((acc, curr) => {
    return curr.type === '+' ? acc + curr.value : acc;
  }, 0);
  const despesa = data.reduce((acc, curr) => {
    return curr.type === '-' ? acc + curr.value : acc;
  }, 0);

  return (
    <div className="bar-status">
      <span>
        <strong>Lançamentos: </strong>
        {data.length}
      </span>
      <span>
        <strong>
          Receitas: <span>R$ {receita}</span>
        </strong>
      </span>
      <span>
        <strong>
          Despesas: <span>R$ {despesa}</span>
        </strong>
      </span>
      <span>
        <strong>
          Saldo: <span>R$ {receita - despesa}</span>
        </strong>
      </span>
    </div>
  );
}

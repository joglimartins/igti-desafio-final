import React, { useState, useEffect } from 'react';
import './App.css';
import BarStatus from './components/BarStatus';
import ListData from './components/ListData';
import Api from './api';
import axios from 'axios';
import M from 'materialize-css';
import { Modal, Button, TextInput, RadioGroup } from 'react-materialize';

export default function App() {
  const [dateSelect, setDateSelect] = useState([]);
  const [dataBd, setDataBd] = useState([]);

  const [filtro, setfiltro] = useState('');

  let monthOpen = new Date().getMonth() + 1;
  const [dataFilter, setDataFilter] = useState(
    new Date().getFullYear() + '-' + monthOpen.toString().padStart(2, '0')
  );

  const [modaledit, setModaledit] = useState(false);
  const [editDataM, setEditDataM] = useState({});

  const [modalnew, setModalnew] = useState(false);
  const [newDataM, setNewDataM] = useState({ type: '+' });

  const selectDateMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const selectDateYears = [
    new Date().getFullYear() - 1,
    new Date().getFullYear(),
    new Date().getFullYear() + 1,
  ];

  const selectData = [];
  for (let i = 0; i < selectDateYears.length; i++) {
    for (let j = 0; j < selectDateMonths.length; j++) {
      selectData.push(
        `${selectDateYears[i]}-${selectDateMonths[j].toString().padStart(2, 0)}`
      );
    }
  }

  useEffect(() => {
    setDateSelect(selectData);
    getDateRegister(dataFilter);
  }, [dataFilter]);

  useEffect(() => {
    getDateRegisterFilter(dataFilter, filtro);
  }, [filtro]);

  const setOnFilterChange = (e) => {
    const textFilter = e.target.value;
    setfiltro(textFilter);
  };

  const selectChange = (e) => {
    const data = e.target.value;
    setDataFilter(data);
  };

  const getDateRegisterFilter = async (date, filter) => {
    const data = await axios.get(Api.url, {
      params: {
        yearMonth: date,
        description: filter,
      },
    });
    setDataBd(data.data);
  };

  const getDateRegister = async (date) => {
    const data = await axios.get(Api.url, {
      params: {
        yearMonth: date,
      },
    });
    setDataBd(data.data);
  };

  const deleteRegister = async (e) => {
    const data = await axios.delete(Api.url, {
      data: {
        id: e,
      },
    });
    getDateRegisterFilter(dataFilter, filtro);
  };

  const editRegister = (e) => {
    setEditDataM(e);
    setModaledit(true);
  };

  const newRegister = () => {
    setNewDataM({});
    setModalnew(true);
  };

  const salveEdit = async () => {
    const data = { ...editDataM };
    delete data._id;
    console.log(data);
    await axios.put(Api.url + '/' + editDataM._id, { ...data });
    setModaledit(false);

    getDateRegisterFilter(dataFilter, filtro);
  };

  const salveNew = async () => {
    const data = { ...newDataM };
    await axios.post(Api.url + '/add', { ...data });
    setModalnew(false);

    getDateRegisterFilter(data.yearMonth, filtro);
  };

  const modalChange = () => {
    setModaledit(!modaledit);
  };

  const modalChangeNew = () => {
    setModalnew(!modalnew);
  };

  const formChange = (e) => {
    let data = null;
    // data[e.target.name] = e.target.value
    switch (e.target.name) {
      case 'type':
        data = { ...editDataM, type: e.target.value };
        break;
      case 'category':
        data = { ...editDataM, category: e.target.value };
        break;
      case 'description':
        data = { ...editDataM, description: e.target.value };
        break;
      case 'value':
        data = { ...editDataM, value: parseInt(e.target.value) };
        break;
      case 'yearMonthDay':
        const yearP = e.target.value.split('-')[0];
        const monthP = e.target.value.split('-')[1].toString().padStart(2, 0);
        const dayP = e.target.value.split('-')[2].toString().padStart(2, 0);
        data = {
          ...editDataM,
          yearMonthDay: e.target.value,
          year: parseInt(yearP),
          month: parseInt(monthP),
          day: parseInt(dayP),
          yearMonth: `${yearP}-${monthP}`,
        };
        break;
    }
    setEditDataM({ ...data });
    console.log(editDataM);
  };

  const formChangeNew = (e) => {
    let data = null;
    switch (e.target.name) {
      case 'yearMonthDay':
        const yearP = e.target.value.split('-')[0];
        const monthP = e.target.value.split('-')[1].toString().padStart(2, 0);
        const dayP = e.target.value.split('-')[2].toString().padStart(2, 0);
        data = {
          ...newDataM,
          yearMonthDay: e.target.value,
          year: parseInt(yearP),
          month: parseInt(monthP),
          day: parseInt(dayP),
          yearMonth: `${yearP}-${monthP}`,
        };
        break;
      default:
        const campo = [];
        campo[e.target.name] = e.target.value;
        data = { ...newDataM, ...campo };
        break;
    }
    setNewDataM(data);
    console.log(newDataM);
  };

  return (
    <div className="container">
      <div className="header">
        <div className="center">
          <h1>Bootcamp Full Stack - Desafio Final</h1>
          <h2>Controle Financeiro Pessoal</h2>
        </div>

        <div className="center selectDate">
          <button className="waves-effect waves-light btn">&lt;</button>

          <select
            value={dataFilter}
            onChange={selectChange}
            className="browser-default"
          >
            {dateSelect.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
          <button className="waves-effect waves-light btn">&gt;</button>
        </div>

        <BarStatus data={dataBd} />

        <div className="form-filter-add">
          <button
            onClick={() => newRegister()}
            className="waves-effect waves-light btn"
          >
            <i className="material-icons left">add</i>NOVO LANÇAMENTO
          </button>
          <input
            type="text"
            name="filtro"
            onChange={setOnFilterChange}
            placeholder="Filtro"
          />
        </div>
      </div>

      <div className="list">
        <ul>
          {dataBd.map((data, index) => (
            <ListData
              key={index}
              data={data}
              del={deleteRegister}
              edit={editRegister}
            />
          ))}
        </ul>
      </div>

      {/* modals */}
      <Modal
        actions={[
          <Button
            flat
            modal="close"
            node="button"
            waves="green"
            onClick={() => modalChange()}
          >
            Cancelar
          </Button>,
          <Button
            node="button"
            modal="close"
            waves="green"
            onClick={() => salveEdit()}
          >
            Salvar
          </Button>,
        ]}
        bottomSheet={false}
        fixedFooter={false}
        open={modaledit}
        options={{
          onCloseStart: () => modalChange(),
          dismissible: false,
        }}
      >
        <div className="form-edit">
          <RadioGroup
            label="Tipo"
            name="type"
            onChange={formChange}
            options={[
              {
                label: 'Receita',
                value: '+',
              },
              {
                label: 'Despesa',
                value: '-',
              },
            ]}
            value={editDataM.type}
            withGap
          />
          <TextInput
            id="category"
            value={editDataM.category}
            label="Categoria"
            name="category"
            onChange={formChange}
          />
          <TextInput
            id="description"
            value={editDataM.description}
            label="Descrição"
            name="description"
            onChange={formChange}
          />
          <TextInput
            id="value"
            name="value"
            value={editDataM.value}
            label="Valor"
            type="number"
            onChange={formChange}
          />
          <TextInput
            id="yearMonthDay"
            name="yearMonthDay"
            value={editDataM.yearMonthDay}
            label="Data"
            type="date"
            onChange={formChange}
          />
        </div>
      </Modal>

      {/* modals create */}
      <Modal
        actions={[
          <Button
            flat
            modal="close"
            node="button"
            waves="green"
            onClick={() => modalChangeNew()}
          >
            Cancelar
          </Button>,
          <Button
            node="button"
            modal="close"
            waves="green"
            onClick={() => salveNew()}
          >
            Salvar
          </Button>,
        ]}
        bottomSheet={false}
        fixedFooter={false}
        open={modalnew}
        options={{
          onCloseStart: () => modalChangeNew(),
          dismissible: false,
        }}
      >
        <div className="form-edit">
          <div>
            <label>
              <input
                name="type"
                type="radio"
                value="+"
                onChange={formChangeNew}
                checked={newDataM.type === '+'}
              />
              <span>Receita</span>
            </label>
            <label>
              <input
                name="type"
                type="radio"
                value="-"
                onChange={formChangeNew}
                checked={newDataM.type === '-'}
              />
              <span>Depesa</span>
            </label>
          </div>
          {/* <RadioGroup
            label="Tipo"
            id="type"
            name="type"
            onChange={formChangeNew}
            options={[
              {
                label: 'Receita',
                value: '+',
              },
              {
                label: 'Despesa',
                value: '-',
              },
            ]}
            value="+"
            withGap
          /> */}
          <TextInput
            id="category"
            label="Categoria"
            name="category"
            onChange={formChangeNew}
          />
          <TextInput
            id="description"
            label="Descrição"
            name="description"
            onChange={formChangeNew}
          />
          <TextInput
            id="value"
            name="value"
            label="Valor"
            type="number"
            min="0"
            onChange={formChangeNew}
          />
          <TextInput
            id="yearMonthDay"
            name="yearMonthDay"
            label="Data"
            type="date"
            onChange={formChangeNew}
          />
        </div>
      </Modal>
    </div>
  );
}

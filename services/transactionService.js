const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

//   description: String,
//   value: Number,
//   category: String,
//   year: Number,
//   month: Number,
//   day: Number,
//   yearMonth: String,
//   yearMonthDay: String,
//   type: String,

// Aqui havia um erro difícil de pegar. Importei como "transactionModel",
// com "t" minúsculo. No Windows, isso não faz diferença. Mas como no Heroku
// o servidor é Linux, isso faz diferença. Gastei umas boas horas tentando
// descobrir esse erro :-/
const TransactionModel = require('../models/TransactionModel');

const getTransactions = async ({ yearMonth, description }) => {
  const data = await TransactionModel.find({
    yearMonth,
    ...(description
      ? { description: { $regex: description, $options: 'i' } }
      : {}),
  });

  return data;
};

const addTransactions = async (data) => {
  // data.yearMonth = `${data.year}-${data.month.toString().padStart(2, 0)}`;
  // data.yearMonthDay = `${data.year}-${data.month
  //   .toString()
  //   .padStart(2, 0)}-${data.day.toString().padStart(2, 0)}`;
  const dataSaved = await TransactionModel.create(data);
  return dataSaved;
};

const delTransactions = async ({ id }) => {
  const data = await TransactionModel.findOneAndDelete({ _id: id });
  return { message: 'Register removed successfully!' };
};

const updateTransactions = async (id, data) => {
  // return { ...data };

  const newData = await TransactionModel.findOneAndUpdate(
    { _id: ObjectId(id) },
    { ...data },
    { new: true }
  );
  return newData;
};

module.exports = {
  getTransactions,
  addTransactions,
  delTransactions,
  updateTransactions,
};

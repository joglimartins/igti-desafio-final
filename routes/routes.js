const express = require('express');
const transactionRouter = express.Router();
const {
  getTransactions,
  addTransactions,
  delTransactions,
  updateTransactions,
} = require('../services/transactionService.js');

transactionRouter.get('/', async (req, res) => {
  return res.send(await getTransactions(req.query));
});

transactionRouter.post('/add', async (req, res) => {
  return res.send(await addTransactions(req.body));
});

transactionRouter.delete('/', async (req, res) => {
  return res.send(await delTransactions(req.body));
});

transactionRouter.put('/:id', async (req, res) => {
  return res.send(await updateTransactions(req.params.id, req.body));
});

module.exports = transactionRouter;

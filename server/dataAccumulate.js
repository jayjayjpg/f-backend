let mutationData = {};
let snpData = {};
let interactionsData = {};

module.exports.create = function(){
  localDataPile = [];
  mutationData.data = require('./data/excel.json');
  mutationData.name = "mutation";
  snpData.data = require('./data/snps.json');
  snpData.name = "snp";
  interactionsData.data = require('./data/interact.json');
  interactionsData.name = "interaction";
  localDataPile.push(mutationData);
  localDataPile.push(snpData);
  localDataPile.push(interactionsData);
  return localDataPile;
};
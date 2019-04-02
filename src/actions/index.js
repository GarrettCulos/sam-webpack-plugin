const { copyAction } = require('./copy');
const { moveAction } = require('./move');
const { mkdirAction } = require('./mkdir');
const { archiveAction } = require('./archive');
const { createAction } = require('./create');
const { rimrafAction } = require('./remove');

module.exports = { copyAction, moveAction, rimrafAction, createAction, mkdirAction, archiveAction, createAction };

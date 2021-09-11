const lodashIsEqual = require('lodash.isequal');

exports.isEqual = (val1, val2) => lodashIsEqual(val1, val2);
exports.isDifferent = (val1, val2) => !lodashIsEqual(val1, val2);

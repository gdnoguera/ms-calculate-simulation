"use strict";

const mongoose = require("mongoose"),
      Schemas = mongoose.Schema;

const SchemaInterest = Schemas({
    "affinityGroup": Number,
    "interestEA":Number,
    "currentInterestEA":Number,
    "moraInterestEA":Number
});

module.exports = mongoose.model("schemasDB", SchemaInterest);


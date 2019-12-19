"use strict";

const SchemaDB = require("../Model/SchemaDataBase");


function saveDB(affinity, res) {
   console.log("proceso de guardar");
   var data = new SchemaDB();
   data.affinityGroup = affinity
   // data.numberFee = req.numberFee
   // data.porcentageIVA = req.iva.porcentageIVA
   data.interestEA = res.TASA_INTERES_EA
   data.currentInterestEA = res.TASA_USURA_INTERES_CORRIENTE_EA
   data.moraInterestEA = res.TASA_USURA_INTERES_MORA_EA
   data.save((err, res) => {
      if (err) { console.log("ocurrio un error en save DB ", err) }
      if (res) { console.log(" se ha guardado en la DB", res) }
   });
};

function FindAffinity(req) {
   return new Promise((resolve, reject) => {
      let valor = true;
      SchemaDB.find({ "affinityGroup": req }, (err, resDB) => {
         if (err) reject(err);
         console.log("respuesta busqueda:" + resDB);
         resolve(resDB);
      });
   })
};

function FindandUpdate(affinity, res) {
   console.log("proceso de actualizar");
   var data = new SchemaDB();
   SchemaDB.findOneAndUpdate({ "affinityGroup": affinity }, { $set: { "interestEA": res.TASA_INTERES_EA, "currentInterestEA": res.TASA_USURA_INTERES_CORRIENTE_EA, "moraInterestEA": res.TASA_USURA_INTERES_MORA_EA } }, (err, res) => {
      if (err) console.log("Error al buscar", err);
      if (res) console.log("se modificado : ", res);

   });
};
function DeleteAll() {
   SchemaDB.deleteMany({}, (err, res) => {
      if (err) console.log("error ", err)
      if (res) console.log("repuesta ", res)
   });
};


function buscar() {
   SchemaDB.find({}, (err, res) => {
      if (err) console.log(err);
      console.log("busqueda (toal " + res)

   });

}


module.exports = { saveDB, DeleteAll, FindAffinity, FindandUpdate, buscar };
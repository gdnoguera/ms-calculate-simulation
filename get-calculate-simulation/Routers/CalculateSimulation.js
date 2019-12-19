"use strict";

const config = require("../Config/Config"),
  soapRequest = require("easy-soap-request"),
  fs = require("fs"),
  path = require("path"),
  DataBase = require("./OperationDataBase"),
  xmlToJson = require("xml-to-json-stream"),
  xmltojason = xmlToJson({ attributeMode: false });

//llamado a Ascard

const CallAscard = async (affinity,req) => {
  console.log("<entrada: ", req, ">");
  const xml = getTemplateXML("Request_simulacionFinanciacion_PS");
  const new_xml = xml.replace("{AFINIDAD}", affinity)
    .replace("{PLAZO}", req.numberFee)
    .replace("{SALDO_FINANCIAR}", req.balanceFinance)
    .replace("{CODIGO_EXENCION_IVA}", req.iva.porcentageIVA);

  const { response } = await soapRequest({
    url: config.soap_url,
    header: header,
    xml: new_xml,
    timeout: config.time_out
  });
  const body_jason = response["body"].replace(/sim:/g, "");
  console.log("repuesta servicio", body_jason);
  var JasonResponse
  try {
    xmltojason.xmlToJson(body_jason, (err, json) => {
      if (err) {
        console.log("error en el xml to json", err);
        throw new Error(err);
      }
      JasonResponse = json["soapenv:Envelope"]["soapenv:Body"]["WS_Result"]["MENSAJE"]["SIMULACION"];
    });
  } catch (e) { console.log("error parseo", e) }
  console.log("respuesta   ", JasonResponse);


  return JasonResponse;
}



//atrapa el schema de la peticion a Ascard
const getTemplateXML = name => {
  const pathfile = path.resolve(__dirname, `../XML/${name}.xml`);
  return fs.readFileSync(pathfile, "utf8");
};


//atrapa el modelo de repuesta del microservicio
const getModleResponse = name => {
  const pathfile = path.resolve(__dirname, `../Model/${name}.json`);
  return fs.readFileSync(pathfile, "utf8");
};


//constante header necesaria para el llamado a Ascard
const header = {
  "user-agent": "ecommerce",
  "Content-Type": "text/xml;charset=utf-8",
  "Accept-Encoding": "gzip,deflate",
  "Content-Length": "",
  "Connection": "Keep-Alive",
  "soapAction": config.soap_action
};


//funcion de calcular cuotas
function Calsimulation(price, iva, interest, numfee) {
  console.log("price :", price, " iva:", iva, " interes:", interest, " cuotas:", numfee);
  var monthInterest = 0, j = 0, fee = 0;
  if (interest > 0) {
    monthInterest = (Math.pow((1 + (interest / 100)), (1 / 12)) - 1);
    console.log("cuota interes mensual:", monthInterest);
    j = (monthInterest * (1 + (iva / 100)));
    console.log("valor j:", j);
    fee = (price * ((j * Math.pow((1 + j), numfee)) / (Math.pow((1 + j), numfee) - 1)));
    console.log("valor de la cuota: ", fee);
    return fee;
  }
  else if (interest == 0) {
    fee = price / numfee;
    console.log("fee", fee);
    return fee;
  }

};

//calcular saldo mas iva
function CalPriceIva (value,iva){
  let price = (value+(value*(iva/100)));
  console.log("<valor precio iva",price,">" )
  return price;
}

//calcular interes mensual
function CalculateInterrestMonth(interest){
  let monthInterest = (Math.pow((1 + (interest / 100)), (1 / 12)) - 1);
  return monthInterest;
};

const Response = function(req,res)
{
  console.log("llegaa res :", res);
  const json = getModleResponse("Response");
  const respJson = json.replace("primerpago",Calsimulation(CalPriceIva(req.balanceFinance,req.iva.porcentageIVA),req.iva.porcentageIVA,res.interestEA,req.numberFee))
                     .replace("saldoafinanciar",CalPriceIva(req.balanceFinance,req.iva.porcentageIVA))
                     .replace("valorcuota",Calsimulation(CalPriceIva(req.balanceFinance,req.iva.porcentageIVA),req.iva.porcentageIVA,res.interestEA,req.numberFee))
                     .replace("porcentajeinteresEA",res.interestEA)
                     .replace("porcentajeinteresEM",CalculateInterrestMonth(res.interestEA))
                     .replace("porcentajeinteresmora",res.moraInterestEA)
                     .replace("porcentajeintereccorriente",res.currentInterestEA);
                     
    return respJson;
 }


 function informationDB() {
  console.log("encontrados" + DataBase.FindAffinity(1));
  let schema = {
     numberFee: 6,
        balanceFinance : 2000,
         iva : {
        porcentageIVA : 19
     }
  };

  console.log("esquema", schema );
  for (let i = 1; i <= 5; i++) {
     console.log("valor de i:", i);

     DataBase.FindAffinity(i)
        .then(r => {
           if (isArray(r) && r.length > 0) {
              console.log("se actualiza");
              CallAscard(i,schema)
                 .then(r => {
                    DataBase.FindandUpdate(i, r)
                 });
           }
           else {
              console.log("se crea");
              CallAscard(i,schema)
                 .then(r => {
                    DataBase.saveDB(i, r);
                 });
           }
        })
        .catch(e => {
           console.log("Error:", e);
        })
  }
};

const isArray = (value) => value instanceof Array;

//tarea programada para obtener los porcentajes de interes
/* var task = Cron.schedule('******',()=>{
 console.log('<seacaba de ejecutar la tarea programa>') });*/

module.exports = { CallAscard, Response , informationDB};
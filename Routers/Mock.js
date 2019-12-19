"use strict";

const path = require("path"),
      fs = require("fs");


const getModleResponse =  name => {
    console.log("<name:",name,">");
    const pathfile = path.resolve(__dirname, `../Model/${name}.json`);
    console.log("<FS resultado", pathfile,">");
    return fs.readFileSync(pathfile, "utf8");
    };
const Response = function(req)
{
  const json = getModleResponse("Response");
  const respJson = json.replace("primerpago",Calsimulation(CalPriceIva(req.balanceFinance,req.iva.porcentageIVA),req.iva.porcentageIVA,29,req.numberFee))
                     .replace("saldoafinanciar",CalPriceIva(req.balanceFinance,req.iva.porcentageIVA))
                     .replace("valorcuota",Calsimulation(CalPriceIva(req.balanceFinance,req.iva.porcentageIVA),req.iva.porcentageIVA,29,req.numberFee))
                     .replace("porcentajeinteresEA",29)
                     .replace("porcentajeinteresEM",29)
                     .replace("porcentajeinteresmora",29);
                     
    return respJson;
 }

//valor iva
function ValueIva(value,iva){
let valueIva=value*(iva/100);
return valueIva;
}

 //calcular saldo mas iva
 function CalPriceIva (value,iva){
    let price = (value+(value*(iva/100)));
    console.log("<valor precio iva",price,">" )
    return price;
 }

//funcion de calcular cuotas
  function Calsimulation (price,iva,interest,numfee){
    console.log("price :",price," iva:",iva," interes:",interest," cuotas:",numfee);
    var monthInterest=0, j=0, fee=0;
    if(interest > 0){
      monthInterest = (Math.pow((1+(interest/100)),(1/12))-1);
      console.log("cuota interes mensual:", monthInterest);
      j = (monthInterest*(1+(iva/100)));
      console.log("valor j:",j);
      fee =(price*((j*Math.pow((1+j),numfee))/(Math.pow((1+j),numfee)-1)));
      console.log("valor de la cuota: ", fee);
      return fee;
    } 
    else if (interest == 0 )
    {
      fee=price/numfee;
      console.log("fee",fee);
      return fee;
    }
    
  };

module.exports = {getModleResponse,Response};
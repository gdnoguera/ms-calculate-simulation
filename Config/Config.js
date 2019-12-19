"use strict";

module.exports = {
    logs: process.env.LOGS || true,
    port: process.env.PORT || 3001,
    time_out: process.env.TIME_OUT || 5000,
    soap_url: process.env.ECOMMERCE_URL_WSDL || "http://localhost:9999/SimulacionFinanciacion?WSDL",
    soap_action: process.env.SOAP_ACTION || "http://www.claro.com.co/financingIntegrator/simulacionFinanciacion"
  };
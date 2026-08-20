/**
 * APMC Mandi & Price Forecast Controller
 * Lead Architect: Principal Commodity Quantitative Analyst
 */

const mandiForecastEngine = require('../services/mandiForecastEngine');

const getLiveRates = (req, res) => {
  const { crop } = req.query;
  const rates = mandiForecastEngine.getLiveMandiRates(crop);
  return res.status(200).json(rates);
};

const getCropForecast = (req, res) => {
  const { crop = 'wheat' } = req.params;
  const forecast = mandiForecastEngine.forecastCommodityPrice(crop);
  return res.status(200).json({ success: true, forecast });
};

module.exports = {
  getLiveRates,
  getCropForecast,
};

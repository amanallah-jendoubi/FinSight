const alertsService = require('../services/alertsService');

const getAllAlerts = async (req, res) => {
  try {
    const result = await alertsService.getAllAlerts(req.userId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const getUnreadAlertsCount = async (req, res) => {
  try {
    const result = await alertsService.getUnreadAlertsCount(req.userId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const updateAlert = async (req, res) => {
  try {
    const { alertId } = req.params;
    const result = await alertsService.updateAlert( alertId );
    return res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllAlerts, getUnreadAlertsCount, updateAlert}
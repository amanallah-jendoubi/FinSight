const express = require ('express');
const router = express.Router ();

router.get('/', require('../controllers/alertsController').getAllAlerts);
router.get('/unreadAlertsCount', require('../controllers/alertsController').getUnreadAlertsCount);
router.patch('/:alertId', require('../controllers/alertsController').updateAlert);

module.exports = router;
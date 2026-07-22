const express = require ('express');
const router = express.Router ();

/**
 * @swagger
 * /alerts:
 *   get:
 *     summary: Get all alerts
 */
router.get('/', require('../controllers/alertsController').getAllAlerts);

/**
 * @swagger
 * /alerts/unreadAlertsCount:
 *   get:
 *     summary: Get the unread alert count
 */
router.get('/unreadAlertsCount', require('../controllers/alertsController').getUnreadAlertsCount);

/**
 * @swagger
 * /alerts/{alertId}:
 *   patch:
 *     summary: Update an alert
 */
router.patch('/:alertId', require('../controllers/alertsController').updateAlert);

module.exports = router;
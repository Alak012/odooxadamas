const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');
const payrollController = require('../controllers/payrollController');

// Employee actions
router.post('/advance', auth, payrollController.requestAdvance);
router.get('/me', auth, payrollController.getMyPayrolls);

// Admin actions
router.get('/advances', auth, authorize('Admin'), payrollController.getAllAdvances);
router.put('/advance/:id/status', auth, authorize('Admin'), payrollController.updateAdvanceStatus);
router.post('/generate/:month', auth, authorize('Admin'), payrollController.generateMonthlyPayroll);
router.get('/all', auth, authorize('Admin'), payrollController.getAllPayrolls);

module.exports = router;

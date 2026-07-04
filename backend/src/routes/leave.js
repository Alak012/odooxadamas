const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');
const leaveController = require('../controllers/leaveController');

// Employee actions
router.post('/apply', auth, leaveController.applyLeave);
router.get('/me', auth, leaveController.getMyLeaves);

// Admin actions
router.get('/all', auth, authorize('Admin'), leaveController.getAllLeaves);
router.put('/:id/status', auth, authorize('Admin'), leaveController.updateLeaveStatus);

module.exports = router;

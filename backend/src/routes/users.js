const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');
const userController = require('../controllers/userController');

// Admin only: Create a new employee
router.post('/', auth, authorize('Admin'), userController.createEmployee);

// Admin only: List all employees
router.get('/', auth, authorize('Admin'), userController.getAllEmployees);

// Any authenticated user: Get own profile
router.get('/me', auth, userController.getMyProfile);

// Any authenticated user: Update own profile
router.put('/me', auth, userController.updateMyProfile);

// Admin only: Manage Admin Emails
router.get('/admin-emails', auth, authorize('Admin'), userController.getAdminEmails);
router.post('/admin-emails', auth, authorize('Admin'), userController.addAdminEmail);
router.delete('/admin-emails/:email', auth, authorize('Admin'), userController.removeAdminEmail);

// Admin only: Manage Invited Employees
router.get('/invited-emails', auth, authorize('Admin'), userController.getInvitedEmails);
router.post('/invited-emails', auth, authorize('Admin'), userController.inviteEmail);
router.delete('/invited-emails/:email', auth, authorize('Admin'), userController.removeInvitedEmail);

// Any authenticated user: View another employee (read-only card click)
router.get('/:id', auth, userController.getEmployeeById);

module.exports = router;

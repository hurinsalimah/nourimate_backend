const express = require('express');
const router = express.Router();
const userController = require('./userController');
const verifyToken = require('../../middleware/auth');

// GET /api/users/:userId/details
router.get('/:userId/details', verifyToken, userController.getUserDetails);

// PUT /api/users/:userId/details
router.put('/:userId/details', verifyToken, userController.updateUserDetails);

// DELETE /api/users/:userId/details
router.delete(
  '/:userId/details',
  verifyToken,
  userController.deleteUserDetails,
);

module.exports = router;

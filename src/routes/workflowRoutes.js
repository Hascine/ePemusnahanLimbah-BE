const express = require('express');
const router = express.Router();
const workflowController = require('../controllers/workflowController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all workflow routes
router.use(authMiddleware);

// --- Read Endpoints ---
router.get('/approval-workflows', workflowController.getApprovalWorkflows);
router.get('/signing-workflows', workflowController.getSigningWorkflows);

// --- Request-specific Endpoints ---
router.get('/approval/:requestId', workflowController.getApprovalWorkflowByRequest);
router.get('/signing/:requestId', workflowController.getSigningWorkflowByRequest);
router.get('/current-approver/:requestId', workflowController.getCurrentApproverForRequest);

// --- Admin Management Endpoints ---
// Approvers
router.post('/approval-steps/:stepId/approvers', workflowController.addApproverToStep);
router.delete('/approvers/:approverConfigId', workflowController.removeApproverFromStep);
router.get('/approval-steps/:stepId/approvers', workflowController.getApproversForStep);

// Signers
router.post('/signing-steps/:stepId/signers', workflowController.addSignerToStep);
router.delete('/signers/:signerConfigId', workflowController.removeSignerFromStep);
router.get('/signing-steps/:stepId/signers', workflowController.getSignersForStep);

// Master Administration Endpoints
router.get('/admin/workflows', workflowController.getAllWorkflowsAdmin);
router.put('/admin/approval-steps/:stepId/bulk-approvers', workflowController.bulkUpdateApprovers);
router.put('/admin/signing-steps/:stepId/bulk-signers', workflowController.bulkUpdateSigners);

module.exports = router;

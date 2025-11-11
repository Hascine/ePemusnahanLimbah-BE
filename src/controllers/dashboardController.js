const {
    PermohonanPemusnahanLimbah,
    ApprovalWorkflowStep,
    ApprovalHistory
} = require('../models');
const { Op } = require('sequelize');

/**
 * Get dashboard statistics for the current user
 * Returns counts for:
 * - My Requests: Total requests created by the user
 * - Pending Approvals: Requests waiting for user's approval
 * - Approved: Requests already approved by the user
 */
exports.getDashboardStats = async (req, res) => {
    try {
        const userId = req.user?.log_NIK;
        const userJobLevel = req.user?.emp_JobLevelID || req.user?.Job_LevelID;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        // 1. Count "My Requests" - all requests created by this user
        let myRequestsCount = 0;
        
        try {
            myRequestsCount = await PermohonanPemusnahanLimbah.count({
                where: {
                    requester_id: userId
                }
            });
        } catch (countError) {
            console.error('[getDashboardStats] Error counting requests:', countError.message);
            myRequestsCount = 0;
        }

        // 2. Count "Pending Approvals" - requests waiting for this user's approval
        // Use the same logic as permohonanController's pendingApproval filter
        let pendingApprovalsCount = 0;
        
        // Check if user has approval authority using external API
        let hasApprovalAuthority = false;
        let userApprovals = [];
        
        try {
            const axios = require('axios');
            const EXTERNAL_APPROVAL_URL = process.env.EXTERNAL_APPROVAL_URL || 'http://192.168.1.38/api/global-dev/v1/custom/list-approval-magang';
            const externalRes = await axios.get(EXTERNAL_APPROVAL_URL);
            const items = Array.isArray(externalRes.data) ? externalRes.data : externalRes.data?.data || [];
            
            // Filter for ePengelolaan_Limbah approvers
            const appItems = items.filter(i => String(i.Appr_ApplicationCode || '') === 'ePengelolaan_Limbah');
            userApprovals = appItems.filter(item => item.Appr_ID === userId);
            
            hasApprovalAuthority = userApprovals.length > 0 || userId === "PJKPO";
        } catch (apiError) {
            console.warn('[getDashboardStats] External API check failed:', apiError.message);
            // Fallback: Check by job level (Manager level = 3 or below usually has approval authority)
            hasApprovalAuthority = userJobLevel && parseInt(userJobLevel) <= 4;
        }
        
        if (hasApprovalAuthority && userApprovals.length > 0) {
            try {
                // Get step levels this user can approve
                const userApprovalSteps = userApprovals
                    .map(item => item.Appr_No)
                    .filter(stepNo => stepNo != null);
                
                // Get all InProgress requests with current step matching user's approval levels
                const pendingRequests = await PermohonanPemusnahanLimbah.findAll({
                    where: {
                        status: 'InProgress',
                        current_step_id: { [Op.ne]: null }
                    },
                    include: [
                        {
                            model: ApprovalWorkflowStep,
                            as: 'CurrentStep',
                            required: true,
                            where: {
                                step_level: {
                                    [Op.in]: userApprovalSteps
                                }
                            }
                        },
                        {
                            model: require('../models').GolonganLimbah,
                            required: false
                        }
                    ]
                });

                // Filter based on specific rules per step level
                const authorizedPendingRequests = pendingRequests.filter(request => {
                    const currentStepLevel = request.CurrentStep?.step_level;
                    
                    // Step 1 (Department Manager): check department matching
                    if (currentStepLevel === 1) {
                        const userDepartments = userApprovals
                            .filter(a => a.Appr_No === 1)
                            .map(a => (a.Appr_DeptID || '').toString().toUpperCase());
                        
                        const requestDepartment = (request.bagian || request.requester_dept_id || '').toString().toUpperCase();
                        return userDepartments.includes(requestDepartment);
                    }
                    
                    // Step 2 (APJ): check golongan based on department
                    if (currentStepLevel === 2) {
                        const userAPJDepts = userApprovals
                            .filter(a => a.Appr_No === 2)
                            .map(a => (a.Appr_DeptID || '').toString().toUpperCase());
                        
                        const golonganName = (request.GolonganLimbah?.nama || '').toLowerCase();
                        
                        // Check if user can approve based on golongan and department
                        if (userAPJDepts.includes('PN1')) {
                            if (golonganName.includes('prekursor') || golonganName.includes('oot')) {
                                return true;
                            }
                        }
                        if (userAPJDepts.includes('QA')) {
                            if (golonganName.includes('recall')) {
                                return true;
                            }
                        }
                        if (userAPJDepts.includes('HC')) {
                            if (request.is_produk_pangan) {
                                return true;
                            }
                        }
                        
                        return false;
                    }
                    
                    // Step 3 (Verification) and Step 4 (HSE Manager): any user with authority can approve
                    return true;
                });

                pendingApprovalsCount = authorizedPendingRequests.length;
            } catch (pendingError) {
                console.error('[getDashboardStats] Error checking pending approvals:', pendingError.message);
                pendingApprovalsCount = 0;
            }
        }

        // 3. Count "Approved" - requests that user has already approved
        // This should match the logic in permohonanController for processedBy
        let approvedCount = 0;
        
        if (hasApprovalAuthority) {
            try {
                // Count distinct requests where:
                // - User appears in ApprovalHistory as approver_id or approver_id_delegated
                // - Status is 'Approved' or 'Rejected' (processed by user)
                // - Exclude requests created by the user themselves
                const approvedRequests = await PermohonanPemusnahanLimbah.count({
                    distinct: true,
                    col: 'request_id',
                    include: [
                        {
                            model: ApprovalHistory,
                            required: true,
                            where: {
                                [Op.and]: [
                                    {
                                        [Op.or]: [
                                            { approver_id: userId },
                                            { approver_id_delegated: userId }
                                        ]
                                    },
                                    { status: { [Op.in]: ['Approved', 'Rejected'] } }
                                ]
                            }
                        }
                    ],
                    where: {
                        requester_id: { [Op.ne]: userId } // Exclude own requests
                    }
                });

                approvedCount = approvedRequests;
            } catch (approvedError) {
                console.error('[getDashboardStats] Error checking approved count:', approvedError.message);
                approvedCount = 0;
            }
        }

        return res.json({
            success: true,
            data: {
                myRequests: myRequestsCount,
                pendingApprovals: pendingApprovalsCount,
                approved: approvedCount
            }
        });

    } catch (error) {
        console.error('[getDashboardStats] Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics',
            error: error.message
        });
    }
};
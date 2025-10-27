const axios = require('axios');

// A simple in-memory cache to avoid hitting the user API too frequently
let userCache = {
    data: null,
    lastFetched: null,
};
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches users from the external API with caching.
 */
const fetchUsersWithCache = async () => {
    const now = new Date();
    if (userCache.data && (now - userCache.lastFetched < CACHE_DURATION_MS)) {
        return userCache.data;
    }

    try {
        const response = await axios.get(process.env.USER_API_ENDPOINT);
        userCache = {
            data: response.data,
            lastFetched: now,
        };
        return response.data;
    } catch (error) {
        console.error("Error fetching users from external API:", error.message);
        // If the cache is stale but the API fails, return the old data if available
        if (userCache.data) {
            return userCache.data;
        }
        throw new Error("Could not fetch user list from the source API.");
    }
};

/**
 * GET /api/users -> List all users from the company API with filtering and sorting
 */
const getAllUsers = async (req, res) => {
    try {
        let users = await fetchUsersWithCache();

        const { search, dept, jobLevel } = req.query;

        // Filtering
        if (search) {
            const searchTerm = search.toLowerCase();
            users = users.filter(user =>
                user.emp_Name.toLowerCase().includes(searchTerm) ||
                user.emp_NIK.toLowerCase().includes(searchTerm)
            );
        }
        if (dept) {
            users = users.filter(user => user.emp_DeptID === dept.toUpperCase());
        }
        if (jobLevel) {
            users = users.filter(user => user.emp_JobLevelID === jobLevel.toUpperCase());
        }

        // Sorting (example: by name)
        users.sort((a, b) => a.emp_Name.localeCompare(b.emp_Name));

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving user list.",
            error: error.message
        });
    }
};

/**
 * GET /api/users/departments -> Get unique departments from cached user data
 */
const getDepartments = async (req, res) => {
    try {
        const users = await fetchUsersWithCache();
        const departments = [...new Set(users.map(user => user.emp_DeptID))].filter(Boolean);
        
        res.status(200).json({
            success: true,
            data: departments.sort()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving departments.",
            error: error.message
        });
    }
};

/**
 * GET /api/users/job-levels -> Get unique job levels from cached user data
 */
const getJobLevels = async (req, res) => {
    try {
        const users = await fetchUsersWithCache();
        const jobLevels = [...new Set(users.map(user => user.emp_JobLevelID))].filter(Boolean);
        
        res.status(200).json({
            success: true,
            data: jobLevels.sort()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving job levels.",
            error: error.message
        });
    }
};

/**
 * GET /api/users/by-nik/:nik -> Get specific user by NIK
 */
const getUserByNik = async (req, res) => {
    try {
        const { nik } = req.params;
        const users = await fetchUsersWithCache();
        const user = users.find(u => u.emp_NIK === nik);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving user.",
            error: error.message
        });
    }
};

/**
 * Utility function to get users by criteria for workflow assignment
 */
const getUsersByCriteria = async (criteria = {}) => {
    try {
        let users = await fetchUsersWithCache();
        
        // Apply filters based on criteria
        if (criteria.dept) {
            users = users.filter(user => user.emp_DeptID === criteria.dept);
        }
        
        if (criteria.jobLevel) {
            users = users.filter(user => user.emp_JobLevelID === criteria.jobLevel);
        }
        
        if (criteria.search) {
            const searchTerm = criteria.search.toLowerCase();
            users = users.filter(user =>
                user.emp_Name.toLowerCase().includes(searchTerm) ||
                user.emp_NIK.toLowerCase().includes(searchTerm)
            );
        }
        
        return users.sort((a, b) => a.emp_Name.localeCompare(b.emp_Name));
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllUsers,
    getDepartments,
    getJobLevels,
    getUserByNik,
    getUsersByCriteria,
    fetchUsersWithCache, // Export for use in workflow logic
};
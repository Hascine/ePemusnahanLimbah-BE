const {
    PermohonanPemusnahanLimbah,
    DetailLimbah,
    GolonganLimbah,
    JenisLimbahB3,
    ApprovalWorkflowStep,
    sequelize
} = require('../models');
const jakartaTime = require('../utils/jakartaTime');

/**
 * Helper function to parse the waste code and type from the nama field.
 */
const parseJenisLimbah = (nama) => {
    if (nama === 'Lain-lain') {
        return { kode_limbah: 'Lain-lain', jenis_limbah: 'Lain-lain' };
    }
    
    const parts = nama.split(' ');
    if (parts.length > 1) {
        const kode_limbah = parts[0];
        const jenis_limbah = parts.slice(1).join(' ');
        return { kode_limbah, jenis_limbah };
    }
    
    // Fallback if there is no space
    return { kode_limbah: nama, jenis_limbah: nama };
};

/**
 * Generate label data for a completed request
 * GET /api/labels/:requestId
 */
const generateLabelsForRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { user, delegatedUser } = req;

        // Find the request with all related data
        const request = await PermohonanPemusnahanLimbah.findByPk(requestId, {
            include: [
                { model: DetailLimbah },
                { model: GolonganLimbah },
                { model: JenisLimbahB3 },
                { model: ApprovalWorkflowStep, as: 'CurrentStep' }
            ]
        });

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Allow label generation only when current step is Verifikasi Lapangan (step_level === 3)
        const isInVerifikasiStep = request.CurrentStep && Number(request.CurrentStep.step_level) === 3;
        if (!isInVerifikasiStep) {
            return res.status(400).json({ 
                message: 'Labels can only be generated for requests in Verifikasi Lapangan step',
                currentStatus: request.status,
                currentStep: request.CurrentStep ? request.CurrentStep.step_level : null
            });
        }

        // Check if request has nomor_permohonan
        if (!request.nomor_permohonan) {
            return res.status(400).json({ 
                message: 'Request must have a nomor_permohonan before labels can be generated'
            });
        }

        const totalBobot = request.DetailLimbahs.reduce((sum, detail) => {
            // parseFloat is used to ensure the value is treated as a number
            return sum + parseFloat(detail.bobot);
        }, 0);

        // Get unique nomor_wadah values to determine number of labels needed
        const uniqueWadahNumbers = [...new Set(
            request.DetailLimbahs
                .filter(detail => detail.nomor_wadah !== null && detail.nomor_wadah !== undefined)
                .map(detail => detail.nomor_wadah)
        )];

        if (uniqueWadahNumbers.length === 0) {
            return res.status(400).json({ 
                message: 'No valid container numbers (nomor_wadah) found for this request'
            });
        }

        // Total waste count is now stored on the main request
        const totalWasteCount = request.jumlah_item || request.DetailLimbahs.length;

        // Parse waste code and type once
        const wasteInfo = parseJenisLimbah(request.JenisLimbahB3?.nama || 'Unknown');

        // Generate label data for each unique container
        const labels = uniqueWadahNumbers.map(wadahNumber => {
            // Find the detail_limbah entry for this container
            const detailForWadah = request.DetailLimbahs.find(detail => detail.nomor_wadah === wadahNumber);
            
            return {
                // Label identification
                nomor_wadah: wadahNumber,
                request_id: request.request_id,
                
                // Header information
                company_name: "PT. Lapi Laboratories",
                company_address: "Kawasan Industri Modern Cikande Kav., Serang",
                company_phone: "0254 - 402150",
                company_fax: "0254 - 402151",
                
                // Request details
                nomor_permohonan: request.nomor_permohonan,
                nomor_penghasil: "KLH - 10410", // Static value as shown in image
                tgl_pengemasan: (() => {
                    const d = new Date();
                    const y = d.getFullYear();
                    const m = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    return `${y}-${m}-${day}`;
                })(),
                
                // Waste information
                jenis_limbah: wasteInfo.jenis_limbah,
                kode_limbah: wasteInfo.kode_limbah,
                jumlah_limbah: totalWasteCount,
                sifat_limbah: request.JenisLimbahB3?.sifat_limbah || 'Unknown',

                // Container specific details
                container_details: detailForWadah ? {
                    nama_limbah: detailForWadah.nama_limbah,
                    jumlah_item: request.jumlah_item || (detailForWadah && detailForWadah.jumlah_item) || 0,
                    satuan: detailForWadah.satuan,
                    bobot: parseFloat(totalBobot).toFixed(2),
                    nomor_analisa: detailForWadah.nomor_analisa,
                    nomor_referensi: detailForWadah.nomor_referensi,
                    alasan_pemusnahan: detailForWadah.alasan_pemusnahan
                } : null,
                
                // Generation metadata
                generated_at: jakartaTime.nowJakarta(),
                generated_by: user.log_NIK,
                generated_by_name: user.Nama
            };
        });

        res.status(200).json({
            success: true,
            data: {
                request_info: {
                    request_id: request.request_id,
                    nomor_permohonan: request.nomor_permohonan,
                    status: request.status,
                    bentuk_limbah: request.bentuk_limbah
                },
                labels: labels,
                total_labels: labels.length,
                total_waste_items: totalWasteCount
            },
            message: `Generated ${labels.length} label(s) for request ${request.nomor_permohonan}`
        });

    } catch (error) {
        console.error('Error generating labels:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating labels',
            error: error.message
        });
    }
};

/**
 * Get label template/format information
 * GET /api/labels/template
 */
const getLabelTemplate = async (req, res) => {
    try {
        const template = {
            title: "LABEL LIMBAH BERBAHAYA DAN BERACUN",
            warning: "PERINGATAN ! LIMBAH BERBAHAYA DAN BERACUN",
            company_info: {
                name: "PT. Lapi Laboratories",
                address: "Kawasan Industri Modern Cikande Kav., Serang",
                phone: "0254 - 402150",
                fax: "0254 - 402151"
            },
            fields: {
                nomor_permohonan: "Request Number",
                nomor_penghasil: "Generator Number (Static: KLH - 10410)",
                tgl_pengemasan: "Packaging Date (timestamp.now())",
                jenis_limbah: "Waste Type",
                kode_limbah: "Waste Code (TODO)",
                jumlah_limbah: "Waste Quantity (count of unique detail_limbah)",
                sifat_limbah: "Waste Nature (Golongan Limbah)",
                nomor: "Container Number (nomor_wadah)"
            },
            colors: {
                background: "#FFFF00", // Yellow background
                warning_text: "#FF0000", // Red text for warning
                regular_text: "#000000" // Black text for regular content
            },
            notes: [
                "Labels are generated based on unique nomor_wadah values",
                "Each label represents one container",
                "Total waste count includes all detail_limbah entries for the request",
                "Only requests in Verifikasi Lapangan (step_level === 3) can generate labels",
                "Tgl. Pengemasan should be handled by frontend with current timestamp"
            ]
        };

        res.status(200).json({
            success: true,
            data: template,
            message: "Label template information retrieved successfully"
        });

    } catch (error) {
        console.error('Error getting label template:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting label template',
            error: error.message
        });
    }
};

/**
 * Get all requests that are eligible for label generation
 * GET /api/labels/eligible-requests
 */
const getEligibleRequestsForLabels = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Include requests that are completed OR currently at Verifikasi Lapangan (CurrentStep.step_level === 3)
        const eligibleRequests = await PermohonanPemusnahanLimbah.findAndCountAll({
            where: {
                nomor_permohonan: {
                    [sequelize.Op.not]: null
                }
            },
            include: [
                { 
                    model: DetailLimbah,
                    where: {
                        nomor_wadah: {
                            [sequelize.Op.not]: null
                        }
                    }
                },
                { model: GolonganLimbah },
                { model: JenisLimbahB3 },
                { model: ApprovalWorkflowStep, as: 'CurrentStep' }
            ],
            // We'll filter results in JS to include only Completed or CurrentStep.step_level === 3
            limit: parseInt(limit),
            offset: offset,
            order: [['created_at', 'DESC']],
            distinct: true
        });

        // Filter rows to only those that are in Verifikasi step (step_level === 3)
        eligibleRequests.rows = eligibleRequests.rows.filter(request => {
            const isVerifikasi = request.CurrentStep && Number(request.CurrentStep.step_level) === 3;
            return isVerifikasi;
        });
        eligibleRequests.count = eligibleRequests.rows.length;

        // Calculate label counts for each request
        const requestsWithLabelCounts = eligibleRequests.rows.map(request => {
            const uniqueWadahNumbers = [...new Set(
                request.DetailLimbahs
                    .filter(detail => detail.nomor_wadah !== null && detail.nomor_wadah !== undefined)
                    .map(detail => detail.nomor_wadah)
            )];

            return {
                ...request.toJSON(),
                label_count: uniqueWadahNumbers.length,
                total_waste_items: request.DetailLimbahs.length
            };
        });

        const totalPages = Math.ceil(eligibleRequests.count / parseInt(limit));

        res.status(200).json({
            success: true,
            data: requestsWithLabelCounts,
            pagination: {
                total: eligibleRequests.count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: totalPages
            },
            message: `Found ${eligibleRequests.count} request(s) eligible for label generation`
        });

    } catch (error) {
        console.error('Error getting eligible requests:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting eligible requests for label generation',
            error: error.message
        });
    }
};

module.exports = {
    generateLabelsForRequest,
    getLabelTemplate,
    getEligibleRequestsForLabels
};

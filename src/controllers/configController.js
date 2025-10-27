// GET /config/permohonan-pemusnahan-limbah-columns
const getPermohonanColumns = (req, res) => {
    const columns = [
      { key: 'nomor_permohonan', label: 'Request Number', type: 'string' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'requester_name', label: 'Requester', type: 'string' },
      { key: 'created_at', label: 'Date Created', type: 'datetime' },
    ];
    res.status(200).json(columns);
  };
  
  // GET /config/berita-acara-columns
  const getBeritaAcaraColumns = (req, res) => {
    const columns = [
      { key: 'berita_acara_id', label: 'Event ID', type: 'string' },
      { key: 'status', label: 'Status', type: 'status' }, // Assuming you add a status field
      { key: 'tanggal', label: 'Date', type: 'date' },
      { key: 'creator_name', label: 'Creator', type: 'string' },
    ];
    res.status(200).json(columns);
  };
  
  // GET /config/status-display-properties
  const getStatusProperties = (req, res) => {
    const properties = {
      Draft: { color: 'gray', icon: 'PencilIcon' },
      InProgress: { color: 'blue', icon: 'ClockIcon' },
      Completed: { color: 'green', icon: 'CheckCircleIcon' },
      Rejected: { color: 'red', icon: 'XCircleIcon' },
    };
    res.status(200).json(properties);
  };
  
  // GET /config/berita-acara-deletable-statuses
  const getDeletableStatuses = (req, res) => {
    // Example: Only events that are drafts or have been rejected can be deleted.
    const statuses = ['Draft', 'Rejected'];
    res.status(200).json(statuses);
  };
  
  module.exports = {
    getPermohonanColumns,
    getBeritaAcaraColumns,
    getStatusProperties,
    getDeletableStatuses,
  };
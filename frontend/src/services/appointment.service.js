// Mock appointment service — swap API calls in for production
const MOCK_DELAY = 800;

export const appointmentService = {
  /**
   * Fetch all appointments (with optional filters)
   * @param {object} filters — { status, doctorId, patientId, date }
   */
  getAll: async (filters = {}) => {
    await new Promise((r) => setTimeout(r, MOCK_DELAY));
    return { success: true, data: [] }; // replace with: api.get('/appointments', { params: filters })
  },

  /**
   * Fetch a single appointment by ID
   */
  getById: async (id) => {
    await new Promise((r) => setTimeout(r, MOCK_DELAY));
    return { success: true, data: null }; // replace with: api.get(`/appointments/${id}`)
  },

  /**
   * Book a new appointment
   * @param {object} payload — { patientId, doctorId, date, time, type, notes }
   */
  book: async (payload) => {
    await new Promise((r) => setTimeout(r, MOCK_DELAY));
    return { success: true, data: { id: Date.now(), ...payload, status: 'upcoming' } };
    // replace with: api.post('/appointments', payload)
  },

  /**
   * Reschedule an existing appointment
   * @param {string|number} id
   * @param {object} payload — { date, time }
   */
  reschedule: async (id, payload) => {
    await new Promise((r) => setTimeout(r, MOCK_DELAY));
    return { success: true, data: { id, ...payload } };
    // replace with: api.patch(`/appointments/${id}/reschedule`, payload)
  },

  /**
   * Cancel an appointment
   * @param {string|number} id
   * @param {string} reason
   */
  cancel: async (id, reason = '') => {
    await new Promise((r) => setTimeout(r, MOCK_DELAY));
    return { success: true, data: { id, status: 'cancelled', reason } };
    // replace with: api.patch(`/appointments/${id}/cancel`, { reason })
  },

  /**
   * Fetch doctor availability for a given date
   * @param {string|number} doctorId
   * @param {string} date — ISO date string
   */
  getDoctorAvailability: async (doctorId, date) => {
    await new Promise((r) => setTimeout(r, MOCK_DELAY));
    return {
      success: true,
      data: [
        '09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM',
        '11:30 AM', '02:00 PM', '02:30 PM', '04:00 PM',
      ],
    };
    // replace with: api.get(`/doctors/${doctorId}/availability`, { params: { date } })
  },

  /**
   * Search patients
   * @param {string} query
   */
  searchPatients: async (query) => {
    await new Promise((r) => setTimeout(r, MOCK_DELAY / 2));
    return { success: true, data: [] };
    // replace with: api.get('/patients/search', { params: { q: query } })
  },
};

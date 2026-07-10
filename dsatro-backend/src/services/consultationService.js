import Consultation from '../models/Consultation.js';

class ConsultationService {
  async createConsultation(payload) {
    if (!payload.name || !payload.mobile) {
      throw new Error('Name and Mobile are mandatory for consultation');
    }
    return await Consultation.create(payload);
  }

  async getAllConsultations() {
    return await Consultation.find().sort({ createdAt: -1 });
  }

  async getConsultationStats() {
    const count = await Consultation.countDocuments();
    return {
      totalConsultations: count,
      lastUpdated: new Date()
    };
  }
}

export default new ConsultationService();

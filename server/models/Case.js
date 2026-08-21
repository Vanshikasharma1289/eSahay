const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ['RTI', 'Consumer Dispute', 'Tenant Rights', 'Electricity/Utility', 'Other'],
    default: 'Other',
  },
  extractedDetails: {
    name: { type: String, default: 'Citizen' },
    caseNumber: { type: String, default: 'N/A' },
    noticeDate: { type: String, default: null },
    keyIssue: { type: String, default: '' },
  },
  applicableRights: [
    {
      right: { type: String, required: true },
      lawSource: { type: String, required: true }, // e.g. "Section 56(1), Electricity Act 2003"
      citationSummary: { type: String, required: true },
    },
  ],
  designatedAuthority: {
    department: { type: String, default: 'Concerned Public Authority' },
    officeAddress: { type: String, default: 'Local Ward/District Office' },
    submissionMode: { type: String, default: 'Online / Registered Post' },
    timelineDays: { type: Number, default: 30 },
  },
  actionSteps: [
    {
      type: String,
    },
  ],
  draftDocument: {
    type: String,
    required: true,
  },
  isResolved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Case', caseSchema);
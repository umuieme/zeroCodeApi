
import mongoose from 'mongoose';
import { uuid } from 'zod/v4-mini';

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  logo: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  owner: { type: String, required: true, },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
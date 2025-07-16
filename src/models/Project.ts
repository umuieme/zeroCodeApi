// Conceptual change in your Project model file (e.g., src/models/Project.ts)
import mongoose from 'mongoose';
import { uuid } from 'zod/v4-mini';

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  logo: { type: String },

  owner: { type: String, required: true, }, // Assuming owner is a UUID string
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
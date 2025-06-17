import mongoose, { Schema } from "mongoose";

const EndpointSchema = new mongoose.Schema(
    {
        projectId: { type: mongoose.Types.ObjectId, required: true, ref: 'Project' },
        name: { type: String, required: true },
        endpoint: { type: String, required: true },
        description: String,
        schema: {
            type: Schema.Types.Mixed,
            required: true
        },
    },
    {
        timestamps: true,
    }
).index({ projectId: 1, endpoint: 1 }, { unique: true });

export default mongoose.models.Endpoint ||
    mongoose.model("Endpoint", EndpointSchema);

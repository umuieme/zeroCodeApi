import mongoose, { Schema } from "mongoose";

const EndpointSchema = new mongoose.Schema(
    {
        projectId: { type: mongoose.Types.ObjectId, required: true, ref: 'Project' },
        userId: { type: String, required: true },
        name: { type: String, required: true },
        endpoint: { type: String, required: true },
        description: String,
        jsonSchema: {
            type: Schema.Types.Mixed,
            required: true
        },
        data: {
            type: [Schema.Types.Mixed],
            default: []
        }
    },
    {
        timestamps: true,
    }
).index({ projectId: 1, endpoint: 1 }, { unique: true });

export default mongoose.models.Endpoint ||
    mongoose.model("Endpoint", EndpointSchema);

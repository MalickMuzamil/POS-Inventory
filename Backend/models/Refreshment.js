import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    averageDailyUsage: { type: Number, default: 0 },
    usedQuantity: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
    refillHistory: [
        {
            date: { type: Date, default: Date.now },
            added: { type: Number, default: 0 },
            reason: { type: String, default: "initial" }
        }
    ],
    status: {
        type: String,
        enum: ["active", "expired", "low_stock", "out_of_stock"],
        default: "active"
    }
});

const refreshmentBatchSchema = new mongoose.Schema(
    {
        batchName: { type: String, required: true },
        expiryDate: { type: Date, required: true },
        addedBy: {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            name: { type: String, required: true },
            role: { type: String, required: true }
        },
        items: [itemSchema],

        batchHistory: [
            {
                date: { type: Date, default: Date.now },
                action: { type: String, enum: ["created", "refill"], default: "created" },
                note: { type: String, default: "" },
                items: [
                    {
                        name: String,
                        quantityChanged: Number
                    }
                ]
            }
        ]
    },
    { timestamps: true }
);

export default mongoose.model("RefreshmentBatch", refreshmentBatchSchema);

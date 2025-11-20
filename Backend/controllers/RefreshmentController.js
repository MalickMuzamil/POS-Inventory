import asyncHandler from "express-async-handler";
import RefreshmentBatch from "../models/Refreshment.js";
import RoleModel from "../models/RoleModel.js";

class RefreshmentController {

    static create = asyncHandler(async (req, res) => {
        const { batchName, items, expiryDate } = req.body;

        const role = await RoleModel.findOne({ userId: req.user._id, is_deleted: false });
        if (!role || role.role !== "admin") {
            return res.status(403).json({ message: "Only admins can create refreshment batches" });
        }

        if (!batchName || !expiryDate || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Please provide batchName, expiryDate, and at least one item.",
            });
        }

        const formattedItems = items.map((item) => {
            if (!item.name || !item.quantity) {
                throw new Error("Each item must include name and quantity");
            }

            return {
                name: item.name.trim(),
                quantity: item.quantity,
                averageDailyUsage: 0,
                usedQuantity: 0,
                lastUpdated: new Date(),
                refillHistory: [
                    { date: new Date(), added: item.quantity, reason: "initial" },
                ],
                status: "active",
            };
        });

        const newBatch = await RefreshmentBatch.create({
            batchName,
            expiryDate: new Date(expiryDate),
            addedBy: {
                userId: req.user._id,
                name: req.user.first_name,
                role: role.role,
            },
            items: formattedItems,
            batchHistory: [
                {
                    date: new Date(),
                    action: "created",
                    note: "Initial batch stock added",
                    items: formattedItems.map(i => ({
                        name: i.name,
                        quantityChanged: i.quantity
                    }))
                }
            ]
        });


        return res.status(201).json({
            message: "✅ Refreshment batch created successfully (one expiry for all items).",
            data: newBatch,
        });
    });

    static getAll = asyncHandler(async (req, res) => {
        const role = await RoleModel.findOne({ userId: req.user._id, is_deleted: false });
        if (!role || role.role !== "admin") {
            return res.status(403).json({ message: "Only admins can view all refreshment batches" });
        }

        const batches = await RefreshmentBatch.find().sort({ createdAt: -1 });
        return res.status(200).json({
            message: "Batches fetched successfully.",
            data: batches,
        });
    });

    static update = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { items } = req.body;

        const role = await RoleModel.findOne({ userId: req.user._id, is_deleted: false });
        if (!role || role.role !== "admin") {
            return res.status(403).json({ message: "Only admins can update stock" });
        }

        const batch = await RefreshmentBatch.findById(id);
        if (!batch) {
            return res.status(404).json({ message: "Batch not found" });
        }

        const now = new Date();
        if (now > new Date(batch.expiryDate)) {
            return res.status(400).json({ message: "Cannot refill expired batch!" });
        }

        const changedItems = [];

        items.forEach((updateItem) => {
            const existingItem = batch.items.find(i => i.name === updateItem.name);
            if (existingItem) {
                const addedQty = updateItem.quantity - existingItem.quantity;
                existingItem.quantity = updateItem.quantity;
                existingItem.lastUpdated = new Date();
                existingItem.refillHistory.push({
                    date: new Date(),
                    added: addedQty > 0 ? addedQty : 0,
                    reason: "refill"
                });

                changedItems.push({ name: existingItem.name, quantityChanged: addedQty });
            }
        });

        batch.batchHistory.push({
            date: new Date(),
            action: "refill",
            note: "Stock refilled by admin",
            items: changedItems
        });

        await batch.save();

        return res.status(200).json({
            message: "Stock refilled successfully.",
            data: batch
        });
    });

    static delete = asyncHandler(async (req, res) => {
        const { id } = req.params;

        const role = await RoleModel.findOne({ userId: req.user._id, is_deleted: false });
        if (!role || role.role !== "admin") {
            return res.status(403).json({ message: "Only admins can delete refreshment batches" });
        }

        const batch = await RefreshmentBatch.findById(id);
        if (!batch) {
            return res.status(404).json({ message: "Batch not found" });
        }

        await RefreshmentBatch.deleteOne({ _id: id });

        return res.status(200).json({
            message: "Batch deleted successfully.",
        });
    });
}

export default RefreshmentController;

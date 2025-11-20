import Ticket from "../models/TicketRaise.js";
import RoleModel from "../models/RoleModel.js";
import asyncHandler from "express-async-handler";

class TicketController {
    static create = asyncHandler(async (req, res) => {
        const { title, description, priority } = req.body;

        const role = await RoleModel.findOne({ userId: req.user._id, is_deleted: false });
        if (!role || role.role !== "employee") {
            return res.status(403).json({ message: "Only employees can create tickets" });
        }

        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required" });
        }

        const ticket = await Ticket.create({
            title,
            description,
            priority,
            createdBy: req.user._id,
        });

        return res.status(201).json({
            message: "Ticket created successfully",
            data: ticket,
        });
    });

    static getMyTickets = asyncHandler(async (req, res) => {
        const tickets = await Ticket.find({
            createdBy: req.user._id,
            is_deleted: false,
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Tickets fetched successfully",
            data: tickets,
        });
    });

    static update = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { title, description, priority, status } = req.body;

        const role = await RoleModel.findOne({ userId: req.user._id, is_deleted: false });
        if (!role || role.role !== "employee") {
            return res.status(403).json({ message: "Only employees can update tickets" });
        }

        const ticket = await Ticket.findOne({ _id: id, createdBy: req.user._id, is_deleted: false });
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        if (title) ticket.title = title;
        if (description) ticket.description = description;
        if (priority) ticket.priority = priority;
        if (status) ticket.status = status;

        const updated = await ticket.save();

        return res.status(200).json({
            message: "Ticket updated successfully",
            data: updated,
        });
    });

    // 🗑 Soft Delete Ticket
    static Delete = asyncHandler(async (req, res) => {
        const { id } = req.params;

        const role = await RoleModel.findOne({ userId: req.user._id, is_deleted: false });
        if (!role || role.role !== "employee") {
            return res.status(403).json({ message: "Only employees can delete tickets" });
        }

        const ticket = await Ticket.findOne({ _id: id, createdBy: req.user._id, is_deleted: false });
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found or already deleted" });
        }

        ticket.is_deleted = true;
        await ticket.save();

        return res.status(200).json({
            message: "Ticket deleted successfully (soft delete)",
        });
    });
}

export default TicketController;

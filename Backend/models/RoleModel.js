import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
    },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const RoleModel = mongoose.model("Role", roleSchema);
export default RoleModel;

import mongoose from "mongoose";
const validStatuses = ["pending", "accepted", "ignored"];

const ConnectionRequestSchema = new mongoose.Schema(
  {
    senderID: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    receiverID: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: validStatuses,
      default : "pending",
      validate: { 
        validator: function (value) {
          return validStatuses.includes(value);
        },
        message: ({ value }) => `${value} is not a valid status type`,
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  ConnectionRequestSchema
);

export default ConnectionRequestModel;

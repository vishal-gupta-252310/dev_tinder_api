const mongoose = require("mongoose");
const AppError = require("../utils/AppError");
const mongooseLeanVirtual = require("mongoose-lean-virtuals");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: "{VALUE} is allowed in status.",
      },
    },
  },
  { timestamps: true }
);

// compound index
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
  const user = this;
  const isSameUser = user.fromUserId.equals(user.toUserId);
  if (isSameUser)
    throw new AppError(400, "Connection request can't be sent to yourself.");
  next();
});

connectionRequestSchema.virtual("connectionId").get(function () {
  return this._id;
});

connectionRequestSchema.plugin(mongooseLeanVirtual);

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;

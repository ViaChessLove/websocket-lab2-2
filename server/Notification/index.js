import { Schema, model } from "mongoose";

const Notification = new Schema({
  id: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

export default model('Notification', Notification);

import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IMessage {
  role: string;
  content: string;
}

export interface IChat extends Document {
  userId: string;
  title: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
});

const ChatSchema = new Schema<IChat>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    messages: { type: [MessageSchema], required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Chat || model<IChat>("Chat", ChatSchema); 
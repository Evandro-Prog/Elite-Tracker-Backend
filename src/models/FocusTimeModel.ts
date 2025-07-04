import { Schema, model } from 'mongoose';

const FocusTimeSchema = new Schema(
  {
    timeFrom: Date,
    timeTo: Date,
    userId: String,
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const FocusTimeModel = model('FocusTime', FocusTimeSchema);

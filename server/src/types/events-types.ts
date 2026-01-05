import mongoose from "mongoose";

export type EventSchemaType = {
  _id: mongoose.Types.ObjectId;
  eventSlug: string;
  eventName: string;

  eventImgUrl: string;
  eventImgId: string;

  eventDescription: string;
  eventLocation: string;
  eventDate: string;
  participantCount: number;
  segmentCount: number;
  isUpcoming: boolean;

  dataUrl: string;
  dataPublicId: string;

  createdAt: string;
  updatedAt: string;
};

export type EventRegistrationSchemaType = {
  _id: mongoose.Types.ObjectId;

  eventId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phoneNumber: string;
  facebookUrl: string;
  photoUrl: string;
  photoPublicId: string;

  institution: string;
  grade: string;

  segments: string[];

  transactionMethod: string;
  transactionPhoneNumber: string;
  transactionId: string;

  reference: string;

  registrationDate: string;
  isVerified: boolean;
  hasAttended: boolean;

  createdAt: string;
  updatedAt: string;
};

export interface UserProfileResponse {
  status: boolean;
  message: string;
  data: {
    user: User;
    totalPackages: number;
  };
}

export interface User {
  subscription: Subscription;
  searchUsage: SearchUsage;

  driverApprovedAt: string | null;
  driverApprovedBy: string | null;
  driverRejectedAt: string | null;
  driverRejectedBy: string | null;
  driverRejectionReason: string;
  driverRequestStatus: "PENDING" | "APPROVED" | "REJECTED";

  location: string | null;

  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  pickupAddress: string;
  dob: string | null;
  gender: "male" | "female" | "other";

  role: "ADMIN" | "USER" | "DRIVER";

  stripeAccountId: string | null;

  bio: string;
  profileImage: string;
  multiProfileImage: string[];

  pdfFile: string;
  drivingLicense: string;

  otp: string | null;
  otpExpires: string | null;
  otpVerified: boolean;

  resetExpires: string | null;
  isVerified: boolean;

  refreshToken: string;

  hasActiveSubscription: boolean;
  subscriptionExpireDate: string | null;

  blockedUsers: string[];
  language: string;

  address: Address;

  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  planId: string | null;
  startDate: string | null;
  endDate: string | null;
}

export interface SearchUsage {
  used: number;
  resetDate: string | null;
}

export interface Address {
  country: string;
  cityState: string;
  roadArea: string;
  postalCode: string;
  taxId: string;
}

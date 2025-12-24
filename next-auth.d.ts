import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      accessToken: string;
      profileImage?: string;
      verified?: boolean;
      location?: string;
      name?: string | null;
      email?: string | null;
      phoneNumber?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    accessToken: string;
    profileImage?: string;
    phoneNumber?: string | null;
  }
}

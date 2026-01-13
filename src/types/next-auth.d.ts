import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    isAdmin: boolean;
    subscriptionTier: string;
    subscriptionExpiry: string | null;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      isAdmin: boolean;
      subscriptionTier: string;
      subscriptionExpiry: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    isAdmin: boolean;
    subscriptionTier: string;
    subscriptionExpiry: string | null;
  }
}

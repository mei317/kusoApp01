export interface Praise {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

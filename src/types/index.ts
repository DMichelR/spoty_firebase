export interface User {
  id: string;
  email: string;
  displayName?: string;
  role: "user" | "admin";
  createdAt: Date;
}

export interface Genre {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
  createdAt: Date;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  genreId: string;
  description?: string;
  createdAt: Date;
}

export interface Song {
  id: string;
  title: string;
  audioUrl: string;
  artistId: string;
  duration?: number;
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signOut: () => Promise<void>;
}

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  resource_type: string;
  format: string;
}

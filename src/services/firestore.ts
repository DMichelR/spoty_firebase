import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Genre, Artist, Song } from "@/types";

// Genre services
export const genreService = {
  async getAll(): Promise<Genre[]> {
    try {
      const q = query(collection(db, "genres"), orderBy("name"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Genre[];
    } catch (error) {
      console.error("Error getting genres:", error);
      throw error;
    }
  },

  async getById(id: string): Promise<Genre | null> {
    try {
      const docRef = doc(db, "genres", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Genre;
      }
      return null;
    } catch (error) {
      console.error("Error getting genre:", error);
      throw error;
    }
  },

  async create(genre: Omit<Genre, "id" | "createdAt">): Promise<string> {
    try {
      // Filter out undefined values to avoid Firestore errors
      const cleanGenre = Object.fromEntries(
        Object.entries(genre).filter(([, value]) => value !== undefined)
      );

      const docRef = await addDoc(collection(db, "genres"), {
        ...cleanGenre,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating genre:", error);
      throw error;
    }
  },

  async update(
    id: string,
    genre: Partial<Omit<Genre, "id" | "createdAt">>
  ): Promise<void> {
    try {
      const docRef = doc(db, "genres", id);
      await updateDoc(docRef, genre);
    } catch (error) {
      console.error("Error updating genre:", error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, "genres", id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting genre:", error);
      throw error;
    }
  },
};

// Artist services
export const artistService = {
  async getAll(): Promise<Artist[]> {
    try {
      const q = query(collection(db, "artists"), orderBy("name"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Artist[];
    } catch (error) {
      console.error("Error getting artists:", error);
      throw error;
    }
  },

  async getByGenre(genreId: string): Promise<Artist[]> {
    try {
      const q = query(
        collection(db, "artists"),
        where("genreId", "==", genreId),
        orderBy("name")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Artist[];
    } catch (error) {
      console.error("Error getting artists by genre:", error);
      throw error;
    }
  },

  async getById(id: string): Promise<Artist | null> {
    try {
      const docRef = doc(db, "artists", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Artist;
      }
      return null;
    } catch (error) {
      console.error("Error getting artist:", error);
      throw error;
    }
  },

  async create(artist: Omit<Artist, "id" | "createdAt">): Promise<string> {
    try {
      // Filter out undefined values to avoid Firestore errors
      const cleanArtist = Object.fromEntries(
        Object.entries(artist).filter(([, value]) => value !== undefined)
      );

      const docRef = await addDoc(collection(db, "artists"), {
        ...cleanArtist,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating artist:", error);
      throw error;
    }
  },

  async update(
    id: string,
    artist: Partial<Omit<Artist, "id" | "createdAt">>
  ): Promise<void> {
    try {
      const docRef = doc(db, "artists", id);
      await updateDoc(docRef, artist);
    } catch (error) {
      console.error("Error updating artist:", error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, "artists", id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting artist:", error);
      throw error;
    }
  },
};

// Song services
export const songService = {
  async getAll(): Promise<Song[]> {
    try {
      const q = query(collection(db, "songs"), orderBy("title"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Song[];
    } catch (error) {
      console.error("Error getting songs:", error);
      throw error;
    }
  },

  async getByArtist(artistId: string): Promise<Song[]> {
    try {
      const q = query(
        collection(db, "songs"),
        where("artistId", "==", artistId),
        orderBy("title")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Song[];
    } catch (error) {
      console.error("Error getting songs by artist:", error);
      throw error;
    }
  },

  async getById(id: string): Promise<Song | null> {
    try {
      const docRef = doc(db, "songs", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Song;
      }
      return null;
    } catch (error) {
      console.error("Error getting song:", error);
      throw error;
    }
  },

  async create(song: Omit<Song, "id" | "createdAt">): Promise<string> {
    try {
      // Filter out undefined values to avoid Firestore errors
      const cleanSong = Object.fromEntries(
        Object.entries(song).filter(([, value]) => value !== undefined)
      );

      const docRef = await addDoc(collection(db, "songs"), {
        ...cleanSong,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating song:", error);
      throw error;
    }
  },

  async update(
    id: string,
    song: Partial<Omit<Song, "id" | "createdAt">>
  ): Promise<void> {
    try {
      const docRef = doc(db, "songs", id);
      await updateDoc(docRef, song);
    } catch (error) {
      console.error("Error updating song:", error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, "songs", id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting song:", error);
      throw error;
    }
  },
};

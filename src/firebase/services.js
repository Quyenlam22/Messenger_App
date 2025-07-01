import { addDoc, collection } from "firebase/firestore";
import { db } from "./config"

export const addDocument = async (collectionName, data) => {
  try {
    const query = collection(db, collectionName);
    await addDoc(query, data);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};
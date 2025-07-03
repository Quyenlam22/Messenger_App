import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";

const useFirestore = (collectionName, condition) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    let q = query(collection(db, collectionName));

    if (condition?.fieldName && condition?.operator && condition?.compareValue?.length) {
      q = query(q, where(condition.fieldName, condition.operator, condition.compareValue));
    }

    q = query(q, orderBy("createdAt"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setDocuments(docs);
    });

    return () => unsubscribe();
  }, [collectionName, condition]);

  return documents;
};

export default useFirestore;

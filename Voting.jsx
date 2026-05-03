"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

const candidates = ["Alice", "Bob", "Charlie"];

export default function Voting() {
  const [user, setUser] = useState(null);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleVote = async () => {
    if (!user) {
      setMessage("Please login first");
      return;
    }

    if (!selected) {
      setMessage("Select a candidate");
      return;
    }

    try {
      await addDoc(collection(db, "votes"), {
        userId: user.uid,
        candidate: selected,
        timestamp: new Date(),
      });

      setMessage("Vote submitted successfully ✅");
    } catch (error) {
      console.error(error);
      setMessage("Error submitting vote ❌");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-3">Vote for your candidate</h2>

      <div className="flex gap-3 mb-4">
        {candidates.map((c) => (
          <button
            key={c}
            onClick={() => setSelected(c)}
            className={`px-4 py-2 rounded ${
              selected === c ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <button
        onClick={handleVote}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit Vote
      </button>

      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}
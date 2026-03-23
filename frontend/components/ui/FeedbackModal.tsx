"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState<"bug" | "feedback">("bug");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!message) return;

    setLoading(true);

    try {
      await apiFetch("/feedback", {
        method: "POST",
        body: JSON.stringify({
          type,
          message,
          page: window.location.pathname
        })
      });

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-zinc-900 p-6 rounded-xl w-full max-w-md space-y-4">
        
        <h2 className="text-lg font-semibold">Feedback</h2>

        <select
          value={type}
          onChange={(e) => setType(e.target.value as any)}
          className="w-full p-2 bg-zinc-800 rounded"
        >
          <option value="bug">Report Issue</option>
          <option value="feedback">General Feedback</option>
        </select>

        <textarea
          placeholder={
            type === "bug"
              ? "What went wrong?"
              : "What was confusing? What stopped you?"
          }
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 bg-zinc-800 rounded h-32"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="text-zinc-400">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="bg-white text-black px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
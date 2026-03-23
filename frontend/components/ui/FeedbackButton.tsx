"use client";

import { useState } from "react";
import FeedbackModal from "./FeedbackModal";

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 px-4 py-2 rounded-full bg-white text-black text-sm shadow-lg"
      >
        Report Issue
      </button>

      {open && <FeedbackModal onClose={() => setOpen(false)} />}
    </>
  );
}
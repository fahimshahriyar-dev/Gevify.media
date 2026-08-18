import React from "react";
import { createPortal } from "react-dom";

interface EditModalOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * Reusable modal overlay component:
 * - Uses React Portal (createPortal) to render directly into document.body,
 *   preventing CSS transform context and scroll parent offsets from breaking `fixed inset-0`.
 * - Positioned `fixed inset-0 z-[100]` to span exactly 100vh / 100vw viewport.
 * - Backdrop blur with dark backdrop overlay.
 * - Centers its modal content perfectly in the middle of the screen.
 */
const EditModalOverlay: React.FC<EditModalOverlayProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default EditModalOverlay;


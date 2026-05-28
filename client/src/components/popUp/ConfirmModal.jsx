import React from "react";
import "./ConfirmModal.css";
import ContinueButton from "../buttons/ContinueButton";

const ConfirmModal = ({
  open,
  title = "Confirm Action",
  message = "Are you sure?",
  onConfirm,
  onCancel,
  loading = false,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  if (!open) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-modal">
        <h3>{title}</h3>

        <p>{message}</p>

        <div className="confirm-actions">
          <button className="cancel-btn" onClick={onCancel}>
            {cancelText}
          </button>

          <ContinueButton
            text={confirmText}
            loading={loading}
            onClick={onConfirm}
            style={{ backgroundColor: "#e74c3c" }}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

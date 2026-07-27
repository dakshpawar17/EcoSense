import React from "react";
import { Modal } from "../ui/Modal";
import { LoginForm } from "./LoginForm";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🔑 Account & Authentication" maxWidth="md">
      <div className="pt-2">
        <LoginForm onSuccess={onClose} showTitle={false} />
      </div>
    </Modal>
  );
};

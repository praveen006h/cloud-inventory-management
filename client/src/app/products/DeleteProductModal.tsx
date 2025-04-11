import React from "react";
import Header from "@/app/(components)/Header";

type DeleteProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  productName: string;
};

const DeleteProductModal = ({
  isOpen,
  onClose,
  onDelete,
  productName,
}: DeleteProductModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Delete Product" />
        <p className="mt-4 text-gray-700">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{productName}</span>?
        </p>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductModal;

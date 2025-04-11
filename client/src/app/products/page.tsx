"use client";

import { useCreateProductMutation, useGetProductsQuery, useDeleteProductMutation } from "@/state/api";
import { PlusCircleIcon, SearchIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import Header from "@/app/(components)/Header";
import Rating from "@/app/(components)/Rating";
import CreateProductModal from "./CreateProductModal";
import DeleteProductModal from "./DeleteProductModal";
import Image from "next/image";

type ProductFormData = {
  name: string;
  price: number;
  stockQuantity: number;
  rating: number;
};


export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ productId: string; name: string } | null>(null);

  const { data: products, isLoading, isError } = useGetProductsQuery(searchTerm);
  const [createProduct] = useCreateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const handleCreateProduct = async (productData: ProductFormData) => {
    await createProduct(productData);
  };

  const handleOpenDeleteModal = (productId: string, name: string) => {
    setProductToDelete({ productId, name });
    setDeleteModalOpen(true);
  };

  const deleteImageFromS3 = async (imageName: string) => {
    if (!imageName) return;
  
    const s3Url = "https://praveenppk-inventorymanagement.s3.ap-south-1.amazonaws.com/" + imageName;
    console.log("Deleting from S3:", s3Url);
    console.log("Deleting from S3:", process.env.S3_BASE_URL);
  
    const response = await fetch(s3Url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (response.ok) {
      console.log("Image successfully deleted from S3");
    } else {
      console.error("Failed to delete image from S3:", response.status, response.statusText);
    }
  };
  

  const handleDeleteProduct = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete.productId);

      const imageName = `${productToDelete.name.toLowerCase().replace(/\s+/g, "-")}.png`; 
      await deleteImageFromS3(imageName); // Delete image from S3

      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  if (isLoading) return <div className="py-4">Loading...</div>;
  if (isError || !products) return <div className="text-center text-red-500 py-4">Failed to fetch products</div>;

  return (
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Products" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Create Product
        </button>
      </div>

      {/* PRODUCT LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
        {products.map((product) => (
          <div key={product.productId} className="border shadow rounded-md p-4 max-w-full w-full mx-auto relative">
            {/* Delete Button */}
            <button
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              onClick={() => handleOpenDeleteModal(product.productId, product.name)}
            >
              <Trash2Icon className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center">
              <Image
                src={`https://praveenppk-inventorymanagement.s3.ap-south-1.amazonaws.com/${product.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}.png`}
                alt={product.name}
                width={150}
                height={150}
                style={{ height: "100px", width: "auto", objectFit: "contain" }}
                className="mb-3 rounded-2xl w-36 h-36"
              />
              <h3 className="text-lg text-gray-900 font-semibold">{product.name}</h3>
              <p className="text-gray-800">₹{product.price.toFixed(2)}</p>
              <div className="text-sm text-gray-600 mt-1">Stock: {product.stockQuantity}</div>
              {product.rating && (
                <div className="flex items-center mt-2">
                  <Rating rating={product.rating} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProduct}
      />

      {/* DELETE MODAL */}
      <DeleteProductModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDeleteProduct}
        productName={productToDelete?.name || ""}
      />
    </div>
  );
}

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const products = await prisma.products.findMany({
      where: {
        name: {
          contains: search,
        },
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId, name, price, rating, stockQuantity } = req.body;
    const product = await prisma.products.create({
      data: {
        productId,
        name,
        price,
        rating,
        stockQuantity,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
};

// Modified deleteProduct function to return Promise<void>
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;

    // Check if the product exists
    const product = await prisma.products.findUnique({
      where: { productId },
    });

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;  // Ensures no further execution
    }

    // Delete the product
    await prisma.products.delete({
      where: { productId },
    });

    // Send empty response with status 204
    res.status(204).send(); // 204 No Content
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};


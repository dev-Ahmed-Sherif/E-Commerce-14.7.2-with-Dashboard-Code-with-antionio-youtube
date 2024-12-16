import * as z from "zod";

export const AddStoreSchema = z.object({
  name: z.string().min(1, {
    message: "Store Name is required",
  }),
});

export const AddBillboardSchema = z.object({
  label: z.string().min(1, {
    message: "Label is required",
  }),
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

export const AddCategorySchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  billboardId: z.string().min(1, {
    message: "Billboard Id is required",
  }),
});

export const sizeSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  value: z.string().min(1, {
    message: "Size Value Id is required",
  }),
});

export const colorSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  value: z.string().min(4).regex(/^#/, {
    message: "String must be a valid hex code",
  }),
});

export const productSchema = z.object({
  name: z.string().min(1, {
    message: "Product Name is required",
  }),
  images: z
    .object({ url: z.string() })
    .array()
    .min(1, { message: "Product Images are required" }),
  price: z.coerce.number().min(1, { message: "Product Price is required" }),
  quantity: z.coerce
    .number()
    .min(1, { message: "Product Quantity is required" }),
  categoryId: z.string().min(1, { message: "Product Category is required" }),
  colorId: z.string().min(1, { message: "Product Color is required " }),
  sizeId: z.string().min(1, { message: "Product Size is required" }),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  // isArchived: z.boolean({
  //   required_error: "isFeatured is required",
  // invalid_type_error: "isFeatured must be a boolean",
  // }),
});

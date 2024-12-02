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

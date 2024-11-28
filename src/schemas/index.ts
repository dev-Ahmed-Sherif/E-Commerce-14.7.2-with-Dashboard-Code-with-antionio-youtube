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

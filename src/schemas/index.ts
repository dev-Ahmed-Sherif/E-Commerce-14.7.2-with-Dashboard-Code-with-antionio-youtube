import * as z from "zod";

export const AddStoreSchema = z.object({
  name: z.string().min(1, {
    message: "Store Name is required",
  }),
});

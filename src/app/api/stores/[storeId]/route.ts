import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { name } = body;

    if (!name) return new NextResponse("Name is required", { status: 400 });

    if (!params.storeId)
      return new NextResponse("Store is required", { status: 400 });

    // Here you can save the updated store to your database
    const updatedStore = await prismadb.store.updateMany({
      where: { id: params.storeId, userId },
      data: { name },
    });

    return NextResponse.json(updatedStore);
  } catch (err) {
    console.log("[STORE_PATCH]:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (!params.storeId)
      return new NextResponse("Store is required", { status: 400 });

    // Here you can save the updated store to your database
    const deletedStore = await prismadb.store.deleteMany({
      where: { id: params.storeId, userId },
    });

    return NextResponse.json(deletedStore);
  } catch (err) {
    console.log("[STORE_DELETE]:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

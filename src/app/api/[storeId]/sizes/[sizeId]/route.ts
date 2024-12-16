import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    if (!params.sizeId)
      return new NextResponse("Size Id is required", { status: 400 });

    // Here you can save the updated store to your database
    const category = await prismadb.size.findUnique({
      where: { id: params.sizeId },
    });

    return NextResponse.json(category);
  } catch (err) {
    console.log("[SIZE_GET]:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const body = await req.json();

    const { name, value } = body;

    if (!name) return new NextResponse("Name is required", { status: 400 });

    if (!value) return new NextResponse("Value is required", { status: 400 });

    if (!params.storeId)
      return new NextResponse("Store is required", { status: 400 });

    if (!params.sizeId)
      return new NextResponse("Size Id is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    // Here you can save the updated store to your database
    const size = await prismadb.size.updateMany({
      where: { id: params.sizeId },
      data: { name, value },
    });

    return NextResponse.json(size);
  } catch (err) {
    console.log("[SIZE_PATCH]:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!params.storeId)
      return new NextResponse("Store is required", { status: 400 });

    if (!params.sizeId)
      return new NextResponse("Billboard Id is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    // Here you can save the updated store to your database
    const sizes = await prismadb.size.delete({
      where: { id: params.sizeId },
    });

    return NextResponse.json(sizes);
  } catch (err) {
    console.log("[SIZE_DELETE]:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

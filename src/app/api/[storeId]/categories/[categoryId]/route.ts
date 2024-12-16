import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { categoryId: string };
  }
) {
  try {
    if (!params.categoryId)
      return new NextResponse("category Id is required", { status: 400 });

    // Here you can save the updated store to your database
    const category = await prismadb.category.findUnique({
      where: { id: params.categoryId },
    });

    return NextResponse.json(category);
  } catch (err) {
    console.log("[CATEGORY_GET]:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const body = await req.json();

    const { name, billboardId } = body;

    if (!name) return new NextResponse("Label is required", { status: 400 });

    if (!billboardId)
      return new NextResponse("Image Url is required", { status: 400 });

    if (!params.storeId)
      return new NextResponse("Store is required", { status: 400 });

    if (!params.categoryId)
      return new NextResponse("Category Id is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    // Here you can save the updated store to your database
    const category = await prismadb.category.updateMany({
      where: { id: params.categoryId },
      data: { name, billboardId },
    });

    return NextResponse.json(category);
  } catch (err) {
    console.log("[CATEGORY_PATCH]:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string; categoryId: string };
  }
) {
  try {
    const { userId } = await auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!params.storeId)
      return new NextResponse("Store is required", { status: 400 });

    if (!params.categoryId)
      return new NextResponse("Billboard Id is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    // Here you can save the updated store to your database
    const category = await prismadb.category.delete({
      where: { id: params.categoryId },
    });

    return NextResponse.json(category);
  } catch (err) {
    console.log("[CATEGORY_DELETE]:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

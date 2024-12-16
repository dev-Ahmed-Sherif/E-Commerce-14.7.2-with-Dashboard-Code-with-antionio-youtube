import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { colorId: string } }
) {
  try {
    if (!params.colorId)
      return new NextResponse("Color Id is required", { status: 400 });

    // Here you can save the updated store to your database
    const color = await prismadb.color.findUnique({
      where: { id: params.colorId },
    });

    return NextResponse.json(color);
  } catch (err) {
    console.log("[COLOR_GET]:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
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

    if (!params.colorId)
      return new NextResponse("Color Id is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    // Here you can save the updated store to your database
    const color = await prismadb.color.update({
      where: { id: params.colorId },
      data: { name, value },
    });

    return NextResponse.json(color);
  } catch (err) {
    console.log("[COLOR_PATCH]:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string; colorId: string };
  }
) {
  try {
    const { userId } = await auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!params.storeId)
      return new NextResponse("Store is required", { status: 400 });

    if (!params.colorId)
      return new NextResponse("Color Id is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    // Here you can save the updated store to your database
    const color = await prismadb.color.delete({
      where: { id: params.colorId },
    });

    return NextResponse.json(color);
  } catch (err) {
    console.log("[COLOR_DELETE]:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

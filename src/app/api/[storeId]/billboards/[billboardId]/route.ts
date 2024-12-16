import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { billboardId: string };
  }
) {
  try {
    if (!params.billboardId)
      return new NextResponse("Billboard Id is required", { status: 400 });

    // Here you can save the updated store to your database
    const billboard = await prismadb.billboard.findUnique({
      where: { id: params.billboardId },
    });

    return NextResponse.json(billboard);
  } catch (err) {
    console.log("[BILLBOARD_GET]:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const body = await req.json();

    const { label, imageUrl } = body;

    if (!label) return new NextResponse("Label is required", { status: 400 });

    if (!imageUrl)
      return new NextResponse("Image Url is required", { status: 400 });

    if (!params.storeId)
      return new NextResponse("Store is required", { status: 400 });

    if (!params.billboardId)
      return new NextResponse("Billboard Id is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    // Here you can save the updated store to your database
    const billboard = await prismadb.billboard.update({
      where: { id: params.billboardId },
      data: { label, imageUrl },
    });

    return NextResponse.json(billboard);
  } catch (err) {
    console.log("[BILLBOARD_PATCH]:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string; billboardId: string };
  }
) {
  try {
    const { userId } = await auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!params.storeId)
      return new NextResponse("Store is required", { status: 400 });

    if (!params.billboardId)
      return new NextResponse("Billboard Id is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    // Here you can save the updated store to your database
    const Billboards = await prismadb.billboard.delete({
      where: { id: params.billboardId },
    });

    return NextResponse.json(Billboards);
  } catch (err) {
    console.log("[BILLBOARD_DELETE]:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

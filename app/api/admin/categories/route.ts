import { prisma } from "@/app/_libs/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  CategoriesIndexResponse,
  CategoryRequestBody,
} from "@/app/_types/Posts";

export const GET = async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json<CategoriesIndexResponse>(
      { categories },
      { status: 200 },
    );
    //json形式でcategoryを返す、
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

//新規カテゴリー作成

export type CreateCategoryResponse = {
  id: number;
};

export const POST = async (request: NextRequest) => {
  try {
    const body: CategoryRequestBody = await request.json();
    const { name } = body;
    const data = await prisma.category.create({
      data: {
        name,
      },
    });
    return NextResponse.json<CreateCategoryResponse>({
      id: data.id,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
};

import { prisma } from "@/app/_libs/prisma";
import { NextRequest, NextResponse } from "next/server";
import { CategoryShowResponse, CategoryRequestBody } from "@/app/_types/Posts";

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  try {
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!category) {
      return NextResponse.json(
        { message: "カテゴリーが見つかりません。" },
        { status: 404 },
      );
    }
    return NextResponse.json<CategoryShowResponse>(
      { category },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

//Get関数まとめ、引数にparams設定、paramsでid取得、
//try（categoryでid取得して、エラーハンドリング、と記事がない時の処理）

//カテゴリー更新

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const { name }: CategoryRequestBody = await request.json();

  try {
    await prisma.category.update({
      //変数に入れなくていい
      where: {
        id: parseInt(id),
      },
      data: {
        name,
      },
    });
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

//↓↓↓記事削除↓↓↓

export const DELETE = async (
  _request: NextRequest, //idだけあれば削除できるので”_”をつけている
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  try {
    await prisma.category.delete({
      where: {
        id: parseInt(id),
      },
    });
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

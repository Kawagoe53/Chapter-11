import { prisma } from "@/app/_libs/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  CategoriesIndexResponse,
  CategoryRequestBody,
} from "@/app/_types/Posts";
import { supabase } from "@/app/_libs/supabase";

export const GET = async (request: NextRequest) => {
  // GET関数の引数からrequestを受け取り、その中にAuthorizationヘッダーが含まれているので、それを取り出す
  const token = request.headers.get("Authorization") ?? "";

  // supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error)
    return NextResponse.json({ status: error.message }, { status: 401 });
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
  // GET関数の引数からrequestを受け取り、その中にAuthorizationヘッダーが含まれているので、それを取り出す
  const token = request.headers.get("Authorization") ?? "";

  // supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error)
    return NextResponse.json({ status: error.message }, { status: 401 });
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

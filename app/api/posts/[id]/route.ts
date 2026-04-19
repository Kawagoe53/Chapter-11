import { prisma } from "@/app/_libs/prisma";
import { PostShowResponse } from "@/app/_types/Posts";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _request: NextRequest,
  //Next.js専用のRequest型,
  //_をつけると「使わない引数」という意味の慣習
  { params }: { params: Promise<{ id: string }> }, //paramsの型定義をしている
) => {
  // paramsの中にidが入っているので、それを取り出す
  const { id } = await params;

  try {
    // idを元にPostをDBから取得
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id), //parseIntで整数に変換(数値ではない)
      },
      // カテゴリーも含めて取得
      include: {
        postCategories: {
          include: {
            category: {
              select: {
                // カテゴリーのidとnameだけ取得
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      //否定、〜がない場合
      return NextResponse.json(
        { message: "記事が見つかりません。" },
        { status: 404 },
      );
    }

    // レスポンスを返す
    return NextResponse.json<PostShowResponse>({ post }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

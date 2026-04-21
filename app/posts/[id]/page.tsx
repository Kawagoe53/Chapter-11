"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDate } from "../../_utils/formatDate";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Post, PostShowResponse } from "@/app/_types/Posts";

export default function PostDetail() {
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [post, setPostDetail] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true); //読み込み中の状態管理

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) {
          setError("取得に失敗しました");
          return;
        }
        const data: PostShowResponse = await res.json();
        //型を明示
        setPostDetail(data.post);
      } catch (e) {
        console.error(e);
        setError("エラーが発生しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetcher();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <p>ローディング中...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-3xl mx-auto bg-white p-8">
        <p className="text-red-600">{error}</p>
        <Link href="/" className="text-blue-600">
          一覧へ戻る
        </Link>
      </div>
    );
  }

  if (!post) return <div>データがありません</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white">
      <Image
        height={116}
        width={157}
        src={
          post.thumbnailImageKey.startsWith("http")
            ? post.thumbnailImageKey
            : "https://placehold.co/157x116"
        }
        className="w-full h-auto object-cover mb-4"
        alt="記事の画像です"
      />
      <div className="text-black">
        <p className="text-sm text-gray-600">
          {formatDate(post.createdAt)},{" "}
          {post.postCategories.map((pc) => pc.category.name).join(", ")}
        </p>
        <h1 className="font-bold text-2xl my-4">{post.title}</h1>
        <div
          className="text-gray-700"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>
        <Link href="/">
          <p className="text-blue-600 mb-8">一覧へ戻る</p>
        </Link>
      </div>
    </div>
  );
}

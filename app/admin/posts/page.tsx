"use client";

import { useEffect, useState } from "react";
import { Post, PostIndexResponse } from "@/app/_types/Posts";
import Link from "next/link";
import { formatDate } from "@/app/_utils/formatDate";
import Image from "next/image";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function AdminPosts() {
  const [adminPosts, setAdminPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useSupabaseSession(); //👈tokenをインポート

  useEffect(() => {
    const fetcher = async () => {
      if (!token) return; //👈
      try {
        const res = await fetch("/api/admin/posts", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token, // 👈 Header に token を付与
          },
        });
        const data: PostIndexResponse = await res.json();
        setAdminPosts(data.posts);
      } catch (e) {
        console.error(e);
        setError("エラーが発生しました");
      } finally {
        setIsLoading(false);
      }
    };
    fetcher();
  }, [token]);

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

  return (
    <div className="bg-white min-h-screen ">
      <div className="relative flex items-center justify-center py-4">
        <h1 className="text-black text-5xl">記事一覧</h1>
        <Link
          href="/admin/posts/new"
          className="hover:bg-blue-500 absolute right-4 bg-blue-600 text-white px-4 py-2 rounded font-bold"
        >
          新規作成
        </Link>
      </div>

      {adminPosts.map((post) => (
        <Link
          href={`/admin/posts/${post.id}`}
          key={post.id}
          className="grid grid-cols-[200px_1fr] gap-4 border-b border-[#e5e7eb] max-w-3xl mx-auto"
        >
          <Image
            height={116}
            width={157}
            src={
              post.thumbnailImageKey.startsWith("https")
                ? post.thumbnailImageKey
                : "https://placehold.co/157x116"
            }
            className="w-fit h-30 shrink-0 object-cover m-3"
            alt="thumbnail"
          />
          <div className="text-black">
            <p>
              {formatDate(post.createdAt)},
              {post.postCategories.map((pc) => pc.category.name).join(", ")}
            </p>
            <p className="font-bold">{post.title}</p>
            <p
              className="text-sm text-gray-700 overflow-hidden line-clamp-2"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}

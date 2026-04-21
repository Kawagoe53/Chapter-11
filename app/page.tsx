"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDate } from "../app/_utils/formatDate";
import { useState } from "react";
import { useEffect } from "react";
import { Post, PostsIndexResponse } from "./_types/Posts";

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) {
          setError("取得に失敗しました");
          return;
        }
        const data: PostsIndexResponse = await res.json();
        //型を明示
        setPosts(data.posts);
      } catch (e) {
        console.error(e);
        setError("エラーが発生しました");
      } finally {
        setIsLoading(false);
      }
    };
    fetcher();
  }, []);

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
    <div className="bg-white min-h-screen">
      <h1 className="text-black flex justify-center text-5xl">記事一覧</h1>

      {posts.map((post) => (
        <Link
          href={`/posts/${post.id}`}
          key={post.id}
          className="grid grid-cols-[200px_1fr] gap-4 border-b border-[#e5e7eb] max-w-3xl mx-auto"
        >
          <Image
            height={116}
            width={157}
            src={
              post.thumbnailImageKey.startsWith("http")
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

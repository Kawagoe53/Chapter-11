"use client";

import { useEffect, useState } from "react";
import { CategoriesIndexResponse } from "@/app/_types/Posts";
import Link from "next/link";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function AdminPosts() {
  const [adminCategories, setAdminCategories] = useState<
    CategoriesIndexResponse["categories"]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useSupabaseSession();

  useEffect(() => {
    const fetcher = async () => {
      try {
        if (!token) return;
        const res = await fetch("/api/admin/categories");
        if (!res.ok) {
          setError("取得に失敗しました");
          return;
        }
        const data: CategoriesIndexResponse = await res.json();
        setAdminCategories(data.categories);
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
        <h1 className="text-black text-5xl">カテゴリー一覧</h1>
        <Link
          href="/admin/categories/new"
          className="hover:bg-blue-500 absolute right-4 bg-blue-600 text-white px-4 py-2 rounded font-bold"
        >
          新規作成
        </Link>
      </div>

      {adminCategories.map((category) => (
        <Link
          href={`/admin/categories/${category.id}`}
          key={category.id}
          className="hover:bg-gray-200 grid grid-cols-[200px_1fr] gap-4 border-b border-[#e5e7eb] max-w-3xl mx-auto"
        >
          <div className="text-black">
            <p className="font-bold">{category.name}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

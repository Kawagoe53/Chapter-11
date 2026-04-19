// #タスク詳細
// 1.既存データの取得・表示カテゴリーIDをもとに現在のnameを
// 取得してフォームに初期表示
// 2.フォームUIの実装入力欄に既存データをセットして編集できる状態にする
// 3.更新APIの呼び出し編集内容をPUTリクエストで送信
// 4.完了後の処理成功したら一覧ページなどにリダイレクト;

"use client";

import { CategoryRequestBody, CategoryShowResponse } from "@/app/_types/Posts";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form } from "../_components/Form";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function FixAdminCategory() {
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [data, setData] = useState<CategoryRequestBody | null>(null);
  const { token } = useSupabaseSession();

  useEffect(() => {
    const fetcher = async () => {
      if (!token) return;
      try {
        const res = await fetch(`/api/admin/categories/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token, // 👈 Header に token を付与
          },
        });
        if (!res.ok) {
          setError("取得に失敗しました");
          return;
        }
        const data: CategoryShowResponse = await res.json(); //これはAPIから受け取るデータの型
        setData({ name: data.category.name });
      } catch (e) {
        console.error(e);
        setError("エラーが発生しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetcher();
  }, [id, token]);

  const updateHandleSubmit = async (data: CategoryRequestBody) => {
    if (!token) return;
    try {
      const requestBody: CategoryRequestBody = {
        name: data.name,
      };
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // 👈 Header に token を付与
        },

        body: JSON.stringify(requestBody),
      });
      if (!res.ok) {
        setError("更新を失敗しました");
        return;
      }
      alert("更新しました");
      router.push("/admin/categories"); //成功したらリダイレクトする
    } catch (e) {
      console.error(e); //開発者用
      setError("エラーが発生しました"); //ユーザー用
    }
  };

  const deleteHandleSubmit = async () => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // 👈 Header に token を付与
        },
      });
      if (!res.ok) {
        setError("削除失敗しました");
        return;
      }
      alert("削除しました");
      router.push("/admin/categories"); //成功したらリダイレクトする
    } catch (e) {
      console.error(e); //開発者用
      setError("エラーが発生しました"); //ユーザー用
    }
  };

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
  if (!data) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <p>データがありません</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">カテゴリー編集</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <Form
        onSubmit={updateHandleSubmit}
        deleteHandleSubmit={deleteHandleSubmit}
        mode="edit"
        defaultValues={data}
      />
    </div>
  );
}

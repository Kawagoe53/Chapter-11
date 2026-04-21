// #新規投稿作成画面 タスク詳細
// 1ページ・フォームUIの作成nameの入力欄を用意
// 2フォームの状態管理入力値をstateで管理する
// 3作成APIの呼び出し作成ボタンを押したらPOSTリクエストを送る
// 4完了後の処理成功したら一覧ページへリダイレクト

"use client";

import { useState } from "react";
import { CategoryRequestBody } from "@/app/_types/Posts";
import { useRouter } from "next/navigation";
import { Form } from "../_components/Form";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function CreateNewCategory() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { token } = useSupabaseSession();

  const onSubmit = async (data: CategoryRequestBody) => {
    try {
      if (!token) return;
      const requestBody: CategoryRequestBody = {
        name: data.name,
      };
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // 👈 Header に token を付与
        },
        body: JSON.stringify(requestBody),
      });
      if (!res.ok) {
        //失敗したら以下の処理
        setError("送信に失敗しました");
        return;
      }
      alert("カテゴリーを作成しました");
      router.push("/admin/categories"); //成功したらリダイレクトする
    } catch (e) {
      console.error(e); //開発者用
      setError("エラーが発生しました"); //ユーザー用
    }
  };
  const defaultValues = { name: "" };
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">カテゴリー作成</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <Form onSubmit={onSubmit} mode="new" defaultValues={defaultValues} />
    </div>
  );
}

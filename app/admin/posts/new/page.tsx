// #新規投稿作成画面 タスク詳細
// 1ページ・フォームUIの作成title・content・thumbnailUrl・categoriesの入力欄を用意
// 2DBからカテゴリ一覧を取得する
// 3フォームの状態管理入力値をstateで管理する
// 4作成APIの呼び出し作成ボタンを押したらPOSTリクエストを送る
// 5完了後の処理成功したら一覧ページへリダイレクト

"use client";

import { useEffect, useState } from "react";
import { CategoriesIndexResponse, PostRequestBody } from "@/app/_types/Posts";
import { useRouter } from "next/navigation";
import { PostForm } from "../_components/Postform";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function CreateNewPost() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // カテゴリの一覧（オブジェクトの配列）が入ってくる
  const [categories, setCategories] = useState<
    CategoriesIndexResponse["categories"]
  >([]);
  const { token } = useSupabaseSession();

  useEffect(() => {
    const getCategories = async () => {
      if (!token) return;
      try {
        const res = await fetch("/api/admin/categories", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token, // 👈 Header に token を付与
          },
        });
        if (!res.ok) {
          setError("取得に失敗しました");
          return;
        }
        const data: CategoriesIndexResponse = await res.json();
        setCategories(data.categories);
      } catch (e) {
        console.error(e);
        setError("エラーが発生しました。");
      }
    };
    getCategories();
  }, [token]);

  const onSubmit = async (data: PostRequestBody) => {
    try {
      if (!token) return;
      const requestBody: PostRequestBody = {
        title: data.title,
        content: data.content,
        thumbnailImageKey: data.thumbnailImageKey,
        categories: data.categories,
      };
      //asyncの中でtry-catchする
      const res = await fetch("/api/admin/posts", {
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
      alert("記事を作成しました");
      router.push("/admin/posts"); //成功したらリダイレクトする
    } catch (e) {
      console.error(e);
      setError("エラーが発生しました");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">記事作成</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <PostForm
        onSubmit={onSubmit}
        defaultValues={{
          title: "",
          content: "",
          thumbnailImageKey: "",
          categories: [],
        }}
        categories={categories}
        mode="new"
      />
    </div>
  );
}

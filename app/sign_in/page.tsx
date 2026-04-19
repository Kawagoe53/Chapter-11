"use client";

import { supabase } from "@/app/_libs/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [email, setEmail] = useState(""); //メアドフォーム管理
  const [password, setPassword] = useState(""); //パス管理
  const [isLoading, setIsLoading] = useState(false); //送信中かどうか
  const router = useRouter(); //リダイレクトするためのやつ

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    // 分割代入でerrorだけ取り出す(replaceするからsessionやuserは使わない)
    const { error } = await supabase.auth.signInWithPassword({
      //ログインAPI
      //ボタンが押されるとStateで管理している値で下記オブジェクトを作り渡す
      email,
      password,
    });

    if (error) {
      alert("ログインに失敗しました");
      console.log(error.message); // ← messageを見る
      console.log(error.status); // ← statusを見る
    } else {
      router.replace("/admin/posts");
      //pushと似ているがreplaceにすると画面遷移後に前のページに戻れない
    }
    setIsLoading(false); //送信中ではない状態
  };

  return (
    <div className="flex justify-center pt-60">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-100">
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            メールアドレス
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="name@company.com"
            required
            onChange={(e) => setEmail(e.target.value)}
            //value="email"これはreplaceするから必要ない
            disabled={isLoading}
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            パスワード
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
            onChange={(e) => setPassword(e.target.value)}
            //value="email"これはreplaceするから必要ない
            disabled={isLoading}
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            disabled={isLoading}
          >
            ログイン
          </button>
        </div>
      </form>
    </div>
  );
}

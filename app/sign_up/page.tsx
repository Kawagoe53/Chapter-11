"use client";

import { supabase } from "@/app/_libs/supabase"; // 前の工程で作成したファイル
import { useForm } from "react-hook-form";
import { LoginForm } from "../_types/Posts";

export default function Page() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    const { error } = await supabase.auth.signUp({
      //サインアップAPI
      //ボタンが押されるとStateで管理している値で下記オブジェクトとして渡されて
      email: data.email,
      password: data.password,
      options: {
        //supabaseのsignUpに任意で渡せる追加設定（リダイレクト先やユーザー情報など）
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/login`, //メールで認証ボタン押すとログイン画面に遷移
      },
    });
    if (error) {
      alert("登録に失敗しました");
    } else {
      reset();
      alert("確認メールを送信しました。");
    }
  };

  return (
    <div className="flex justify-center pt-60">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 w-full max-w-100"
      >
        <div>
          <label
            htmlFor="email" //ラベルとinputの紐付け
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            メールアドレス
          </label>
          <input
            type="email" //入力形式
            id="email" //ラベルとinputの紐付け
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="name@company.com"
            {...register("email", {
              required: "入力必須",
            })}
            disabled={isSubmitting} //送信中に入力できないようにしている
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
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
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            {...register("password", {
              required: "入力必須",
              maxLength: { value: 30, message: "最大30文字です" },
            })}
            disabled={isSubmitting}
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            disabled={isSubmitting} //送信中はボタンを押せないようにしている
          >
            登録
          </button>
        </div>
      </form>
    </div>
  );
}

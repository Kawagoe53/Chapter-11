"use client";

import { supabase } from "@/app/_libs/supabase";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { LoginForm } from "../_types/Posts";

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();
  const router = useRouter(); //リダイレクトするためのやつ

  const onSubmit = async (data: LoginForm) => {
    // 分割代入でerrorだけ取り出す(replaceするからsessionやuserは使わない)
    const { error } = await supabase.auth.signInWithPassword({
      //ログインAPI
      email: data.email,
      password: data.password,
    });

    if (error) {
      alert("ログインに失敗しました");
      console.log(error.message); // ← messageを見る
      console.log(error.status); // ← statusを見る
    } else {
      router.replace("/admin/posts");
      //pushと似ているがreplaceにすると画面遷移後に前のページに戻れない
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
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="name@company.com"
            {...register("email", {
              required: "入力必須",
            })}
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          >
            ログイン
          </button>
        </div>
      </form>
    </div>
  );
}

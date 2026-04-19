"use client";

import { supabase } from "@/app/_libs/supabase"; // 前の工程で作成したファイル
import { useState } from "react";

export default function Page() {
  const [email, setEmail] = useState(""); //メアドを管理する
  const [password, setPassword] = useState(""); //パスを管理する
  const [isSubmitting, setIsSubmitting] = useState(false); //送信中かどうかを判断する

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //submitイベントの発生元であるフォームが持つデフォルトの動作をキャンセルするメソッド
    //HTMLのデフォの動作であるページの再読み込みをさせないため
    //(handleSubmit の処理がちゃんと最後まで実行される)
    //event:~とevent.~は生のフォームではお決まりのやつ

    setIsSubmitting(true); //送信中

    const { error } = await supabase.auth.signUp({
      //サインアップAPI
      //ボタンが押されるとStateで管理している値で下記オブジェクトとして渡されて
      //supabase.auth.signUpで登録処理
      email, //Stateで管理している文字列
      password, //Stateで管理している文字列
      options: {
        //supabaseのsignUpに任意で渡せる追加設定（リダイレクト先やユーザー情報など）
        emailRedirectTo: `http://localhost:3000/login`, //メールで認証ボタン押すとログイン画面に遷移
      },
    });
    if (error) {
      alert("登録に失敗しました");
    } else {
      setEmail("");
      setPassword(""); //エラーじゃなければフォームを空白にしてアラートを表示
      alert("確認メールを送信しました。");
    }
    setIsSubmitting(false); //処理が終わったらfalseにして送信中ではない状態になる
  };

  return (
    <div className="flex justify-center pt-60">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-100">
        <div>
          <label
            htmlFor="email" //ラベルとinputの紐付け
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            メールアドレス
          </label>
          <input
            type="email" //入力形式
            name="email" //サーバーへ送信するときのキー名(なくてもいい慣習的に書いている？)
            id="email" //ラベルとinputの紐付け
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="name@company.com"
            required //入力必須
            onChange={(e) => setEmail(e.target.value)} //Stateで入力画面の管理
            value={email} //StateとUIの同期
            disabled={isSubmitting} //送信中に入力できないようにしている
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
            value={password}
            disabled={isSubmitting}
          />
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

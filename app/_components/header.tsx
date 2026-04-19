"use client";

import Link from "next/link";
import React from "react";
import { useSupabaseSession } from "../_hooks/useSupabaseSession";
import { supabase } from "../_libs/supabase";
import { useRouter } from "next/navigation";

export const Header: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    await router.replace("/");
  };

  const { session, isLoading } = useSupabaseSession();

  return (
    <header className="bg-gray-800 text-white p-6 font-bold flex justify-between items-center">
      <Link href="/" className="text-white no-underline font-bold">
        Blog
      </Link>
      {!isLoading && ( //論理積演算子の特性→左側が true の場合: 右側の式を評価（実行）する。
        <div className="flex items-center gap-4">
          {session ? ( //ログイン中の場合
            <>
              <Link href="/admin" className="text-white no-underline font-bold">
                管理画面
              </Link>
              <button onClick={handleLogout}>ログアウト</button>
            </>
          ) : (
            //ログイン中ではない場合
            <>
              <Link
                href="/contact"
                className="text-white no-underline font-bold"
              >
                お問い合わせ
              </Link>
              <Link
                href="/sign_in"
                className="text-white no-underline font-bold"
              >
                ログイン
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

//アクセス制限のロジックを一括管理するためのカスタムhook;

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useRouteGuard = () => {
  const router = useRouter(); //リダイレクト用
  const { session, isLoading } = useSupabaseSession(); //取り出す

  useEffect(() => {
    if (isLoading) return; // sessionの取得中は何もしない.returnで処理終わらせる

    const fetcher = async () => {
      if (session === null) {
        router.replace("/sign_in");
      } //ログイン状態じゃなかったら画面遷移する
    };

    fetcher();
  }, [router, isLoading, session]); //変更があればfetcherを実行
};

//ログイン状態をチェックするためのカスタムhook(特別な関数)
//コンポーネントはJSXを返す、カスタムhookは値を返す
//hookには use から始まる命名ルールがある

import { supabase } from "@/app/_libs/supabase";
import { Session } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

//sessionとはログインしている状態そのものを表すオブジェクト
//(「誰がログインしているか」の情報がまるごと入っているもの)
//tokenとはsessionの中に入っているログイン済みの証明書みたいなもの
//(APIにリクエストを送るときに「このtokenを持っている人はログイン済みですよ」と証明するために使う。)

export const useSupabaseSession = () => {
  // undefined: ログイン状態ロード中, null: ログインしていない, Session: ログインしている
  const [session, setSession] = useState<Session | null | undefined>(undefined); //ユーザーの認証状態を管理
  const [token, setToken] = useState<string | null>(null); //sessionからtokenだけ取り出して別管理
  const pathname = usePathname(); //現在のURLのパスを取得

  useEffect(() => {
    const fetcher = async () => {
      const {
        data: { session }, //getSessionからsessionを取り出す（ただの変数）
      } = await supabase.auth.getSession(); //ログインセッション情報取得API
      setSession(session); //取り出したsessionをStateに保存する
      setToken(session?.access_token || null);
      // sessionがある（ログイン中）→ access_tokenをtokenのStateに保存
      // sessionがない（未ログイン）→ nullをtokenのStateに保存
    };

    fetcher();
  }, [pathname]); //pathnameが変わる度にfetcher が実行される

  return { session, isLoading: session === undefined, token };
  //Stateは必要最低限にするのがReactの基本
  //sessionのStateを見れば isLoading は自動的に決まるので、わざわざ別でStateを作る必要がない
  //比較演算時は比較した結果を true か false で返す

  //ログイン状態のチェックだけならsessionだけでいいがコードをシンプルに書けるようにするためにtokenも使う
  //毎回 session.access_token と書かなくて済むように最初から token として取り出して管理
};

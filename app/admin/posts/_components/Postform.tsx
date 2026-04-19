import TextInput from "@/app/_components/TextInput";
import { CategoriesIndexResponse, PostRequestBody } from "@/app/_types/Posts";
import { useForm } from "react-hook-form";
import { supabase } from "@/app/_libs/supabase";
import { v4 as uuidv4 } from "uuid"; // 固有IDを生成するライブラリ
import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";

type Props = {
  mode: "new" | "edit";
  deleteHandleSubmit?: () => Promise<void>;
  onSubmit: (data: PostRequestBody) => Promise<void>;
  categories: CategoriesIndexResponse["categories"];
  defaultValues: PostRequestBody;
};

export const PostForm = ({
  onSubmit,
  categories,
  defaultValues,
  mode,
  deleteHandleSubmit,
}: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<PostRequestBody>({ defaultValues });
  //画像アップロード
  //① ユーザーが画像を選ぶ
  // ↓
  //② Supabaseにアップロード → keyが返ってくる → thumbnailImageKeyに保存
  // ↓
  //③ keyを使ってURLを取得 → thumbnailImageUrlに保存

  const [thumbnailImageKey, setThumbnailImageKey] = useState("");
  //Supabaseにアップロードした後に返ってくる、ファイルの保存場所（パス）を持つ

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>, //inputの値が変わったときに自動で渡されるイベント情報/お決まりのやつ
  ): Promise<void> => {
    //// 画像が選択されていない場合はreturnするif文
    if (!event.target.files || event.target.files.length == 0) {
      //OR条件なので、どちらか一方でも当てはまればreturnする
      //左：filesがnullやundefined（ファイルが何も無い）右：filesはあるけど中身が空
      //条件の順番はfilesがnullのままlengthを見ようとするとエラーになるのでこの順番になる
      return;
    }

    const file = event.target.files[0]; // 選択された画像を取得

    const filePath = `private/${uuidv4()}`; // ファイルパスを指定

    // Supabaseに画像をアップロード
    const { data, error } = await supabase.storage
      .from("post_thumbnail") // ここでバケット名を指定
      .upload(filePath, file, {
        cacheControl: "3600", //3600秒（1時間）キャッシュしていいよ
        upsert: false, //同じパスにファイルが既にあったとき上書きするかどうか false→しない
      });

    // アップロードに失敗したらエラーを表示して終了
    if (error) {
      alert(error.message);
      return;
    }

    //dataはSupabaseのアップロード成功時にSupabaseが自動で返してくれるオブジェクト
    //非同期処理は成功かどうかの判定と次の処理のためにresponceやdataなどの結果を返す
    // data.pathに、画像固有のkeyが入っているので、thumbnailImageKeyに格納する
    setThumbnailImageKey(data.path);
    setValue("thumbnailImageKey", data.path);
  };

  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>( //画像の公開URLを持つ
    null,
  );
  useEffect(() => {
    if (!thumbnailImageKey) return;
    //thumbnailImageKeyが空だったらreturn(画像アップロードできてなかったら)

    // アップロード時に取得した、thumbnailImageKeyを用いて画像のURLを取得
    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("post_thumbnail")
        .getPublicUrl(thumbnailImageKey); //保存済みファイルのURLを取得   （読み込み）

      setThumbnailImageUrl(publicUrl);
    };

    fetcher();
  }, [thumbnailImageKey]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-6">
        <TextInput
          disabled={isSubmitting}
          label="タイトル"
          {...register("title", {
            required: "必須項目です",
            maxLength: { value: 30, message: "最大30文字です" },
          })}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>
        )}

        <div className="flex flex-col gap-1">
          <label
            className="font-bold text-gray-700"
            htmlFor="thumbnailImageKey"
          >
            サムネイルURL
          </label>
          <input
            disabled={isSubmitting}
            type="file"
            id="thumbnailImageKey"
            onChange={handleImageChange}
            accept="image/*"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {thumbnailImageUrl && (
            <div className="mt-2">
              <Image
                className=" height: 'auto'"
                src={thumbnailImageUrl}
                alt="thumbnail"
                width={400}
                height={400}
              />
            </div>
          )}
          {errors.thumbnailImageKey && (
            <p className="mt-1 text-xs text-red-400">
              {errors.thumbnailImageKey.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-bold text-gray-700">本文</label>
          <textarea
            disabled={isSubmitting}
            id="content"
            {...register("content", {
              required: "必須項目です",
              maxLength: {
                value: 50,
                message: "50文字以内で入力してください",
              },
            })}
            className="border border-gray-300 rounded px-3 py-2 h-48 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.content && (
            <p className="mt-1 text-xs text-red-400">
              {errors.content.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold text-gray-700">カテゴリー</label>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center gap-1">
                <input
                  disabled={isSubmitting}
                  type="checkbox"
                  id={`${category.id}`} //大規模開発だと`category-${category.id}`がいい
                  onChange={(e) => {
                    const current = getValues("categories") ?? [];
                    if (e.target.checked) {
                      setValue("categories", [...current, { id: category.id }]);
                    } else {
                      setValue(
                        "categories",
                        current.filter((c) => c.id !== category.id),
                      );
                    }
                  }}
                />
                <label htmlFor={`${category.id}`} className="text-gray-700">
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-200 text-white font-bold py-2 px-6 rounded self-end"
        >
          {mode == "new" ? "作成する" : "更新する"}
        </button>
        {mode == "edit" && (
          <button
            disabled={isSubmitting}
            onClick={deleteHandleSubmit}
            className="bg-red-500 hover:bg-red-200 text-white font-bold py-2 px-6 rounded self-end"
          >
            削除
          </button>
        )}
      </div>
    </form>
  );
};

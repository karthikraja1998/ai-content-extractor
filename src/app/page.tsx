import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { api, HydrateClient } from "~/trpc/server";
import Input from "../app/_components/input";
export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  console.log("🚀 ~ Home ~ hello:", hello);
  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <Input />
      </main>
    </HydrateClient>
  );
}

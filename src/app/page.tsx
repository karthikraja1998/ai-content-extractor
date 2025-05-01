import { api, HydrateClient } from "~/trpc/server";
import App from "./App";
export default async function Home() {
  return (
    <HydrateClient>
      <App />
    </HydrateClient>
  );
}

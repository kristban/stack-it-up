import HomeClient from "./components/HomeClient";
import { getSupplements } from "./lib/supplements";

export default async function Home() {
  const supplements = await getSupplements();
  return <HomeClient supplements={supplements} />;
}

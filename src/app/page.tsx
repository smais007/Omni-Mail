import LinkAccountButton from "@/components/link-account";
import { UserButton, UserProfile } from "@clerk/nextjs";

export default async function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <LinkAccountButton />
      <UserButton />
    </div>
  );
}

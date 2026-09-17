import { redirect } from "next/navigation";

export default function TopicsRedirectPage() {
  redirect("/dashboard/topics-recaps");
}

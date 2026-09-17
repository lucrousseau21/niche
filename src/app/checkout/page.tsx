import { redirect } from "next/navigation";

type SearchParams = Promise<{
  plan?: string | string[];
  price?: string | string[];
  [key: string]: string | string[] | undefined;
}>;

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const queryString = new URLSearchParams();

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (typeof value === "string") {
        queryString.set(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((v) => queryString.append(key, v));
      }
    }
  }

  const qs = queryString.toString();
  redirect(`/paiement${qs ? `?${qs}` : ""}`);
}
import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import LandingPage from "@/components/LandingPage";
import DashboardHome from "@/components/DashboardHome";
import Footer from "@/components/Footer";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let subjects: { nom: string; description: string }[] = [];
  if (user) {
    const { data } = await supabase.from("sujet").select("nom, description");
    if (data) {
      subjects = data;
    }
  }

  return (
    <div className="min-h-screen flex flex-col pt-24">
      <Header />
      {user ? (
        <DashboardHome user={user} subjects={subjects} />
      ) : (
        <LandingPage />
      )}
      <Footer />
    </div>
  );
}

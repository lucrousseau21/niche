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
    // 1. Get IDs from profile
    const { data: profileData } = await supabase
      .from("profil")
      .select("id_sujet")
      .eq("user_id", user.id);

    const ids = profileData?.map((p) => p.id_sujet) || [];

    if (ids.length > 0) {
      // 2. Get details from subjects
      const { data: subjectsData } = await supabase
        .from("sujet")
        .select("nom, description")
        .in("id_sujet", ids);

      if (subjectsData) {
        subjects = subjectsData;
      }
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

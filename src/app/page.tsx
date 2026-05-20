import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import LandingPage from "@/components/LandingPage";
import DashboardHome from "@/components/DashboardHome";
import Footer from "@/components/Footer";
import { fetchUserMvpSubjects } from "@/lib/profil-preferences";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const subjects = user ? await fetchUserMvpSubjects(supabase, user.id) : [];

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

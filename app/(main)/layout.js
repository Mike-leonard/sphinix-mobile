import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import CompareDrawer from "@/components/CompareDrawer";
import { CompareProvider } from "@/context/CompareContext";
import { cookies } from "next/headers";
import { getSettings } from "@/actions/settings";
import { redirect } from "next/navigation";
import { verifySession } from "@/actions/auth";

export default async function MainLayout({ children }) {
  const cookieStore = await cookies();
  const settings = await getSettings();

  if (settings.maintenance?.maintenanceMode) {
    redirect('/maintenance');
  }

  const user = await verifySession();

  return (
    <CompareProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <CompareDrawer />
      </div>
    </CompareProvider>
  );
}
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { CompareProvider } from "@/context/CompareContext";
import { cookies } from "next/headers";

export default async function MainLayout({ children }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  
  let user = null;
  if (sessionCookie && sessionCookie.value) {
    try {
      user = JSON.parse(sessionCookie.value);
    } catch (e) {
      console.error("Failed to parse session cookie", e);
    }
  }

  return (
    <CompareProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </CompareProvider>
  );
}
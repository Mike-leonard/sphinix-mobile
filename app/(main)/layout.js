import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { CompareProvider } from "@/context/CompareContext";

export default function MainLayout({ children }) {
  return (
    <CompareProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </CompareProvider>
  );
}
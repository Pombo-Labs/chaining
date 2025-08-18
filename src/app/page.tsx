import Link from "next/link";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Text */}
          <h1 className="text-6xl md:text-7xl font-light tracking-tight leading-tight mb-8">
            Build skills
            <br />
            <span className="font-normal">with chain</span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            Transform complex life skills into simple, manageable steps. 
            Empower your child with autism through evidence-based behavioral chaining.
          </p>
          
          {/* CTA */}
          <Link href="/signin">
            <Button 
              size="lg" 
              className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-base font-medium transition-colors"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

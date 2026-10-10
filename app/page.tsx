import Hero from "../components/Hero";
import CollectionShowcase from "../components/CollectionShowcase";
import AboutBrand from "../components/AboutBrand";
import ContactSection from "../components/ContactSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <CollectionShowcase />
      <AboutBrand />
      <ContactSection />
    </main>
  );
}

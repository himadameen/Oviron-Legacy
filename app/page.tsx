import AnnouncementBar from "@/components/AnnouncementBar";
import BuyerFeedback from "@/components/BuyerFeedback";
import BuyerProcess from "@/components/BuyerProcess";
import CapabilityStrip from "@/components/CapabilityStrip";
import CollectionGrid from "@/components/CollectionGrid";
import ContactSection from "@/components/ContactSection";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import IntroSplash from "@/components/IntroSplash";
import ScrollOnLoad from "@/components/ScrollOnLoad";
import MediaBanner from "@/components/MediaBanner";
import OvironApproach from "@/components/OvironApproach";
import PrivateLabel from "@/components/PrivateLabel";
import ProductSpecifications from "@/components/ProductSpecifications";
import QualityAssurance from "@/components/QualityAssurance";
import QualityGrades from "@/components/QualityGrades";

export default function HomePage() {
  return (
    <>
      <ScrollOnLoad />
      <IntroSplash />
      <AnnouncementBar />
      <Header />
      <main id="main-content">
        <Hero />
        <QualityAssurance />
        <MediaBanner />
        <CapabilityStrip />
        <CollectionGrid />
        <Gallery />
        <OvironApproach />
        <ProductSpecifications />
        <QualityGrades />
        <PrivateLabel />
        <BuyerProcess />
        <BuyerFeedback />
        <FAQ />
        <ContactSection />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}

import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import QuemSomos from "./pages/QuemSomos";
import Services from "./pages/Services";
import Networking from "./pages/Networking";
import Work from "./pages/Work";
import Fashion from "./pages/Fashion";
import Contact from "./pages/Contact";

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  return (
    <div className="relative">
      <div className="grain" aria-hidden="true" />
      <Nav />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/quem-somos" element={<QuemSomos />} />
          <Route path="/silky-software" element={<Services />} />
          <Route path="/networking" element={<Networking />} />
          <Route path="/neighbourhood" element={<Work />} />
          <Route path="/fashion" element={<Fashion />} />
          <Route path="/reach-out" element={<Contact />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

export default App;

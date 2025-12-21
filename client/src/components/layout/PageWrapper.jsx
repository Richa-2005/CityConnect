import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PageWrapper({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "80vh" }}>{children}</main>
      <Footer />
    </>
  );
}

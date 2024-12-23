import Footer from "@/components/store/layout/footer";
import Navbar from "@/components/store/layout/navbar";
import StoreModalProvider from "@/providers/modal-store-provider";

type StoreLayoutProps = {
  children: React.ReactNode;
};

const Storelayout = ({ children }: StoreLayoutProps) => {
  return (
    <>
      <StoreModalProvider />
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default Storelayout;

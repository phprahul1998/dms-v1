import Image from "next/image";
import Sidebar from "./component/sidebar";
import Footer from "./component/footer";
export default function Home() {
  return (
    <div className="wrapper">
      <Sidebar/>
      <Footer/>
    </div>
  );
}

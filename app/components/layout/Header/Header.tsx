import HeaderTop from "./HeaderTop";
import HeaderInfo from "./HeaderInfo";
import Navbar from "./Navbar";

export default function Header() {
    return (
        <>
        <header className="sticky top-0 z-50 bg-red-900 shadow-lg" id="site-header">
            <HeaderTop />
            <HeaderInfo />
            <Navbar />
            </header>
        </>
    );
}

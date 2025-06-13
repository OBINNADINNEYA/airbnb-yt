import Image from "next/image";
import Link from "next/link";
import DesktopLogo from "../../public/airbnb-desktop.png";
import DesktopLogophysio from "../../public/PhysioSpace_Logo_2560x800.png";
import MobileLogo from "../../public/airbnb-mobile.webp";
import { UserNav } from "./UserNav";
import { SearchModalComponent } from "./SearchComponent";

export function Navbar() {
  return (
    <nav className="w-full bg-transparent">
      <div className="flex items-center justify-between container mx-auto px-5 lg:px-10 py-3">
        <Link href="/">
          <Image
            src={DesktopLogophysio}
            alt="Desktop Logo"
            className="w-64 hidden lg:block"
          />

          <Image
            src={MobileLogo}
            alt="Mobile Logo"
            className="block lg:hidden w-12"
          />
        </Link>

        <div className="justify-self-center">
          <SearchModalComponent />
        </div>

        <UserNav />
      </div>
    </nav>
  );
}

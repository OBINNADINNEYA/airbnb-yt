import Image from "next/image";
import Link from "next/link";
import DesktopLogophysio from "../../public/physioVerseicon2560x800.png";
import { UserNav } from "./UserNav";
import { SearchModalComponent } from "./SearchComponent";

export function Navbar() {
  return (
    <nav className="w-full bg-transparent">
      <div className="flex items-center justify-between container mb-x px-5 lg:px-10 py-3">
        <Link href="/">
          <Image
            src={DesktopLogophysio}
            alt="Desktop Logo"
            className="w-64 hidden lg:block"
          />

          <Image
            src={DesktopLogophysio}
            alt="Mobile Logo"
            className="block lg:hidden w-64"
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

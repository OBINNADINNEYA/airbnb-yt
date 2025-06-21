import Image from "next/image";
import Link from "next/link";
import DesktopLogophysio from "../../public/physioVerseicon2560x800.png";
import { UserNav } from "./UserNav";
import { SearchModalComponent } from "./SearchComponent";

export function Navbar() {
  return (
    <nav className="w-full">
      <div className="grid items-center grid-cols-3 w-full px-5 lg:px-10 py-5">
        <Link href="/">
          <Image
            src={DesktopLogophysio}
            alt="Desktop Logo"
            className="w-48 hidden lg:block"
          />
          <Image
            src={DesktopLogophysio}
            alt="Mobile Logo"
            className="block lg:hidden w-32"
          />
        </Link>
        <div className="flex justify-center">
          <SearchModalComponent />
        </div>
        <div className="flex justify-end">
          <UserNav />
        </div>
      </div>
    </nav>
  );
}

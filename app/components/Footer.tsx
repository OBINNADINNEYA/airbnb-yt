import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="w-full py-4 px-8 flex items-between justify-between bg-transparent text-green-500 text-sm">
      <div className="flex items-center gap-2">
        <span>© 2025 PhysioSpace, Inc.</span>
        <span className="mx-2">·</span>
        <a href="#" className="hover:underline">Privacy</a>
        <span className="mx-2">·</span>
        <a href="#" className="hover:underline">Terms</a>
        <span className="mx-2">·</span>
        <a href="#" className="hover:underline">Sitemap</a>
      </div>
      <div className="flex items-center gap-4">
        <a href="#" aria-label="Facebook" className="hover:opacity-70"><FaFacebookF size={18} /></a>
        <a href="#" aria-label="X / Twitter" className="hover:opacity-70"><FaXTwitter size={18} /></a>
        <a href="#" aria-label="Instagram" className="hover:opacity-70"><FaInstagram size={18} /></a>
      </div>
    </footer>
  );
} 
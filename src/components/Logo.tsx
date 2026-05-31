import { Link } from "@tanstack/react-router";
import rmLogo from "@/assets/rm logo png.png";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center shrink-0 ${className}`} aria-label="RM Sign Factory home">
      <img
        src={rmLogo}
        alt="RM Sign Factory"
        className="h-16 w-auto object-contain scale-125 origin-left"
      />
    </Link>
  );
}

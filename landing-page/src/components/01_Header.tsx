import { generateWaUrl } from "@/utils/whatsappUrl";
import { FaPhoneAlt } from "react-icons/fa";

export default function Header() {
  return (
    <div className="bg-red-500 relative z-20 w-full h-8 my-auto px-4 py-1">
      <a
        href={generateWaUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white flex gap-1 my-auto items-center hover:underline"
      >
        <FaPhoneAlt />
        <p>+62 857-7488-5367</p>
      </a>
    </div>
  );
}

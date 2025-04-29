import { FaPhoneAlt } from "react-icons/fa";

export default function Header() {
  return (
    <div className="bg-red-500 w-full h-8 my-auto px-4 py-1">
      <span className="text-white flex gap-1 my-auto items-center">
        <FaPhoneAlt />
        <p>+62 857-7488-5367</p>
      </span>
    </div>
  );
}

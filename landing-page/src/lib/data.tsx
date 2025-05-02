import { Contacts } from "@/@types/interfaces";
import { Category } from "@/components/Hero/interface";
import { CiMapPin } from "react-icons/ci";
import { FaPaperPlane, FaPhoneAlt } from "react-icons/fa";
import { MdAccessTimeFilled } from "react-icons/md";

export const categories: Category[] = [
  {
    imageSrc: "/nugget.jpg",
    caption: "Nugget",
  },
  {
    imageSrc: "/Otak-otak.jpg",
    caption: "Otak-otak",
  },
  {
    imageSrc: "/Kornet.webp",
    caption: "Kornet",
  },
  {
    imageSrc: "/Sosis.jpg",
    caption: "Sosis",
  },
];

export const contactData: Contacts[] = [
  {
    icon: <CiMapPin />,
    title: "Alamat Toko",
    body: "Kp. Kalen Kramat, Desa Sukawangi, Kecamatan Sukawangi, Kabupaten Bekasi, Jawa Barat",
  },
  {
    icon: <FaPaperPlane />,
    title: "Informasi Umum",
    body: "muhamadaqil383@gmail.com",
  },
  {
    icon: <FaPhoneAlt />,
    title: "Kontak Kami",
    body: "+62 857-7488-5367",
  },
  {
    icon: <MdAccessTimeFilled />,
    title: "Waktu Buka",
    body: "Senin s/d Minggu | 06:00 s/d 20:00",
  },
];
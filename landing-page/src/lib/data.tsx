import { Contacts, Product } from "@/@types/interfaces";
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

export const products: Product[] = [
  {
    id: "CHAM003",
    name: "Champ Crunchy Nugget 225g",
    price: 18000,
    category: "Nugget",
    imageSrc: "/products/Champ Crunchy Nugget 225g.jpg",
  },
  {
    id: "CHAM006",
    name: "Champ Chicken Nugget 250g",
    price: 18000,
    category: "Nugget",
    imageSrc: "/products/Champ Chicken Nugget 250g.jpg",
  },
  {
    id: "CHAM005",
    name: "Champ Chicken Nugget Coin 250g",
    price: 17000,
    category: "Nugget",
    imageSrc: "/products/Champ Chicken Nugget Coin 250g.jpg",
  },
  {
    id: "HEMA001",
    name: "Hemato Nugget Ayam 500g",
    price: 20000,
    category: "Nugget",
    imageSrc: "/products/Hemato Nugget Ayam 500g.jpg",
  },
  {
    id: "HEMA002",
    name: "Hemato Nugget Ayam 250g",
    price: 11000,
    category: "Nugget",
    imageSrc: "/products/Hemato Nugget Ayam 250g.jpg",
  },
  {
    id: "SALA001",
    name: "Salam Chicken Nugget 250g",
    price: 12000,
    category: "Nugget",
    imageSrc: "/products/Salam Chicken Nugget 250g.jpg",
  },
  {
    id: "SUKA001",
    name: "Sukaku Nugget",
    price: 6000,
    category: "Nugget",
    imageSrc: "/products/Sukaku Nugget.jpg",
  },
  {
    id: "CHAM007",
    name: "Champ Chicken Sausage 275g (15 pcs)",
    price: 20000,
    category: "Sosis",
    imageSrc: "/products/Champ Chicken Sausage 275g (15 pcs).jpg",
  },
  {
    id: "WADI001",
    name: "Wadidaw Sosis 420g (21 pcs)",
    price: 17000,
    category: "Sosis",
    imageSrc: "/products/Wadidaw Sosis 420g (21 pcs).jpg",
  },
  {
    id: "GEBO001",
    name: "Geboooy Sosis 420g (21 pcs)",
    price: 16000,
    category: "Sosis",
    imageSrc: "/products/Geboooy Sosis 420g (21 pcs).jpg",
  },
  {
    id: "BASS001",
    name: "888 Bassiss Sosis 420g (21 pcs)",
    price: 16000,
    category: "Sosis",
    imageSrc: "/products/888 Bassiss Sosis 420g (21 pcs).jpg",
  },
  {
    id: "RIFK001",
    name: "Rifky Jaya Otak-otak 250g (10 pcs)",
    price: 5000,
    category: "Otak-otak",
    imageSrc: "/products/Rifky Jaya Otak-otak 250g (10 pcs).jpg",
  },
];

import { comicRelief, poppins, tuffy } from "@/app/fonts";
import { JSX } from "react";
import { CiMapPin } from "react-icons/ci";
import { FaPaperPlane, FaPhoneAlt } from "react-icons/fa";
import { MdAccessTimeFilled } from "react-icons/md";

export default function ContactUs() {
  return (
    <section id="contactus" className="pt-4 pb-12 min-h-screen px-4 md:px-8 bg-cover bg-center bg-no-repeat bg-darken bg-[url('/contact-us-background.jpg')]">
      <h2
        className={`text-center ${comicRelief.className} text-5xl text-white`}
      >
        Kontak Kami
      </h2>
      <div className="grid gap-2 grid-rows-2 md:grid-rows-1 grid-cols-1 md:grid-cols-2 mt-4">
        <GoogleMap />
        <Contact />
      </div>
    </section>
  );
}

const GoogleMap = () => {
  return (
    <div>
      <h2 className={`${poppins.className} text-white mb-2`}>
        Temukan Kami di Google Maps 👇
      </h2>
      <div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4348.556361359586!2d107.12255293625856!3d-6.135094202023735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6987bb45f9e861%3A0xf0cb066927a33d85!2sAqil%20Frozen%20Food!5e0!3m2!1sid!2sid!4v1745834786209!5m2!1sid!2sid"
          width="600"
          height="450"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-2xl w-full"
        ></iframe>
      </div>
    </div>
  );
};

interface Contacts {
  icon: JSX.Element;
  title: string;
  body: string;
}

const Contact = () => {
  return (
    <div className="border-2 border-white rounded-2xl p-6 shadow-lg bg-opacity-80 backdrop-blur-lg">
      {contactData.map((data, i) => (
        <article key={i} className="my-6">
          <span className="flex gap-2 items-center font-semibold text-white underline hover:text-yellow-300 transition-all duration-300">
            {data.icon}
            <h3 className={`${tuffy.className} text-lg`}>{data.title}</h3>
          </span>
          <p className={`text-white ${poppins.className} text-sm md:text-base mt-2`}>
            {data.body}
          </p>
        </article>
      ))}
    </div>
  );
};


const contactData: Contacts[] = [
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

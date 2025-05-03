import { poppins, tuffy } from "@/app/fonts";
import { contactData } from "@/lib/data";

export default function Contact() {
  return (
    <div className="border-2 border-white rounded-2xl p-6 shadow-lg bg-opacity-80 backdrop-blur-lg">
      {contactData.map((data, i) => (
        <article key={i} className="my-6">
          <span className="flex gap-2 items-center font-semibold text-white underline hover:text-yellow-300 transition-all duration-300">
            {data.icon}
            <h3 className={`${tuffy.className} text-lg`}>{data.title}</h3>
          </span>
          <p
            className={`text-white ${poppins.className} text-sm md:text-base mt-2`}
          >
            {data.body}
          </p>
        </article>
      ))}
    </div>
  );
}

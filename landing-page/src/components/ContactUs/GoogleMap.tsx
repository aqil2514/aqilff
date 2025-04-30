import { poppins } from "@/app/fonts";

export default function GoogleMap() {
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
}

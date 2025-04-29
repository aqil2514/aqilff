import { comicRelief, poppins } from "@/app/fonts";

export default function AboutUs() {
  return (
    <div id="aboutus" className="pb-12 px-4 bg-gradient-to-b from-orange-400 to-yellow-300">
      <h2 className={`text-center ${comicRelief.className} font-bold text-4xl md:text-5xl text-white mb-6`}>
        Tentang Kami
      </h2>
      
      <div className="border-4 border-white md:w-2/3 mx-auto my-6 p-8 bg-slate-100 bg-opacity-80 rounded-3xl shadow-lg">
        <p className={`text-center ${poppins.className} text-lg md:text-xl text-gray-800`}>
          Selamat datang di <strong className="text-orange-600">Aqil Frozen Food</strong>! <br />
          <em className="italic text-orange-600">Hadirkan Kelezatan Beku ke Rumah Anda!</em>
          <br />
          <br />
          Kami adalah penyedia produk frozen food berkualitas tinggi yang siap
          memenuhi kebutuhan harian Anda. Berawal dari keinginan untuk
          menghadirkan makanan praktis, lezat, dan bergizi, kami berkomitmen
          untuk selalu menyediakan produk-produk terbaik dengan harga yang
          terjangkau.
          <br />
          <br />
          Semua produk kami dipilih dengan selektif, disimpan dalam standar
          penyimpanan beku terbaik, dan dikirimkan dalam kondisi segar hingga ke
          tangan Anda. Kami percaya bahwa makanan praktis tidak harus
          mengorbankan kualitas dan rasa.
          <br />
          <br />
          Dengan pelayanan yang ramah dan proses belanja yang mudah, kami
          berharap bisa menjadi pilihan utama keluarga Anda dalam memenuhi
          kebutuhan frozen food sehari-hari.
          <br />
          <br />
          Terima kasih telah mempercayakan kebutuhan Anda kepada kami!
        </p>
      </div>
    </div>
  );
}

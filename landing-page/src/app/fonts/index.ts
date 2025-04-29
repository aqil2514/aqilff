import { Poppins } from "next/font/google";
import localFont from "next/font/local";

export const tagesschrift = localFont({
    src: "./fonts/Tagesschrift-Regular.ttf",
  });
  
  export const comicRelief = localFont({
    src: "./fonts/ComicRelief-Regular.ttf",
  });
  
  export const poppins = Poppins({
    subsets: ['latin', 'latin-ext'], 
    weight: ['400', '500', '600'],  
    display: 'swap',                 
  });
  
  export const tuffy = localFont({
    src: "./fonts/Tuffy-Regular.ttf",
  });
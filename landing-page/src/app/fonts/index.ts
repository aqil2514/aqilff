import { Poppins } from "next/font/google";
import localFont from "next/font/local";

export const tagesschrift = localFont({
    src: "./Tagesschrift-Regular.ttf",
  });
  
  export const comicRelief = localFont({
    src: "./ComicRelief-Regular.ttf",
  });
  
  export const poppins = Poppins({
    subsets: ['latin', 'latin-ext'], 
    weight: ['400', '500', '600'],  
    display: 'swap',                 
  });
  
  export const tuffy = localFont({
    src: "./Tuffy-Regular.ttf",
  });
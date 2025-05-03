// import { tuffy } from "@/app/fonts";
// import React from "react";
// import Review from "./Review";
// import InputOptions from "./Input";

// export default function WAClarification({
//   setDialogue,
//   dialogue,
// }: {
//   dialogue: boolean;
//   setDialogue: React.Dispatch<React.SetStateAction<boolean>>;
// }) {
//   return (
//     <div
//       className={`absolute flex justify-center duration-200 items-center top-0 left-0 bg-black/50 w-full h-full ${
//         dialogue ? "opacity-100 visible" : "opacity-0 invisible"
//       }`}
//       onClick={(e) => {
//         if (e.target === e.currentTarget) {
//           setDialogue(false);
//         }
//       }}
//     >
//       <div className="w-[95%] md:w-4/5 h-3/4 md:h-1/2 bg-slate-100 rounded-2xl overflow-y-scroll">
//         <h2
//           className={`text-center text-xl font-bold my-4 ${tuffy.className} !font-extrabold`}
//         >
//           Satu Langkah Lagi
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 px-2 grid-rows-2 md:grid-rows-1">
//           <InputOptions />
//           <Review />
//         </div>
//       </div>
//     </div>
//   );
// }

import { tuffy } from "@/app/fonts";
import React, { useState } from "react";
import Review from "./Review";
import InputOptions from "./Input";
import { InputWaOptions } from "./interface";

export default function WAClarification({
  setDialogue,
  dialogue,
}: {
  dialogue: boolean;
  setDialogue: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [orderOptions, setOrderOptions] = useState<InputWaOptions>({
    name: "",
    shippingCost: 0,
    note: "",
  });

  return (
    <div
      className={`absolute flex justify-center duration-200 items-center top-0 left-0 bg-black/50 w-full h-full ${
        dialogue ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setDialogue(false);
        }
      }}
    >
      <div className="w-[95%] md:w-4/5 h-3/4 md:h-1/2 bg-slate-100 rounded-2xl overflow-y-scroll">
        <h2
          className={`text-center text-xl font-bold my-4 ${tuffy.className} !font-extrabold`}
        >
          Satu Langkah Lagi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 px-2 grid-rows-2 md:grid-rows-1 gap-4 pb-8">
          <InputOptions options={orderOptions} setOptions={setOrderOptions} />
          <Review options={orderOptions} />
        </div>
      </div>
    </div>
  );
}

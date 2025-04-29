type MessageType = "basic";
type MessageWa = string | MessageType;

export const phoneNumber = "6285774885367";
export const basicMessage = encodeURIComponent(
  "Halo, saya tahu dari situs https://aqilff.shop dan saya tertarik dengan produk Anda."
);

export const generateWaUrl = (message?: MessageWa) => {
  let msg: string;
  if (!message) msg = basicMessage;
  else msg = message;

  return `https://wa.me/${phoneNumber}?text=${msg}`;
};

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export function PayQr({ value }: { value: string }) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    if (!value) {
      setSrc("");
      return;
    }
    if (
      value.startsWith("data:image") ||
      (/^https?:\/\//i.test(value) && /\.(png|jpe?g|svg|gif|webp)/i.test(value))
    ) {
      setSrc(value);
      return;
    }
    void QRCode.toDataURL(value, {
      margin: 1,
      width: 280,
      color: { dark: "#e8e0d4", light: "#00000000" },
    }).then(setSrc);
  }, [value]);

  if (!src) return <div className="size-56 animate-pulse rounded-2xl bg-void-elevated" />;
  return <img src={src} alt="" width={224} height={224} className="size-56 rounded-2xl" />;
}

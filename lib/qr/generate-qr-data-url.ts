import QRCode from "qrcode";

export async function generateQrDataUrl(value: string) {
  return QRCode.toDataURL(value, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 320,
  });
}

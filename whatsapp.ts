export function makeWhatsAppBookingUrl(phone: string, details: {
  service: string; customerName: string; city: string; address: string; preferredTime: string;
}) {
  const message = [
    "HomeFix booking request",
    `Service: ${details.service}`,
    `Customer: ${details.customerName}`,
    `City/area: ${details.city}`,
    `Address: ${details.address}`,
    `Preferred time: ${details.preferredTime}`,
  ].join("\n");
  return `https://wa.me/${phone.replace(/\\D/g, "")}?text=${encodeURIComponent(message)}`;
}

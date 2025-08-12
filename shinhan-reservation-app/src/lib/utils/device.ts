export function getDeviceType() {
  const ua = navigator.userAgent;
  return /Mobi|Android|iPhone/i.test(ua) ? "Mobile" : "PC";
}

export function getDeviceInfo() {
  const ua = navigator.userAgent;
  const deviceType = getDeviceType();
  return `${deviceType} - ${ua}`;
}

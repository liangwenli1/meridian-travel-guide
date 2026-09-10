export function latLngToVector3(
  lat: number,
  lng: number,
  radius = 1,
): { x: number; y: number; z: number } {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return {
    x: -radius * Math.sin(phi) * Math.cos(theta),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta),
  };
}

export function vector3ToLatLng(x: number, y: number, z: number) {
  const radius = Math.sqrt(x * x + y * y + z * z) || 1;
  const lat = 90 - (Math.acos(y / radius) * 180) / Math.PI;
  const lng = (Math.atan2(z, -x) * 180) / Math.PI - 180;
  return { lat, lng: ((lng + 540) % 360) - 180 };
}

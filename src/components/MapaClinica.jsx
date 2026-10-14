import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { CLINICA } from "../data/clinica.js";

// Los íconos por defecto de Leaflet no se resuelven con bundlers: se cargan desde el CDN.
const CDN = "https://unpkg.com/leaflet@1.9.4/dist/images";
const icono = L.icon({
  iconUrl: `${CDN}/marker-icon.png`,
  iconRetinaUrl: `${CDN}/marker-icon-2x.png`,
  shadowUrl: `${CDN}/marker-shadow.png`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapaClinica({ altura = 360 }) {
  return (
    <MapContainer center={[CLINICA.lat, CLINICA.lng]} zoom={15} scrollWheelZoom={false} style={{ height: altura, width: "100%" }}>
      <TileLayer attribution="&copy; colaboradores de OpenStreetMap" url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[CLINICA.lat, CLINICA.lng]} icon={icono}>
        <Popup>
          <strong>{CLINICA.nombre}</strong>
          <br />
          {CLINICA.direccion}
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default MapaClinica;

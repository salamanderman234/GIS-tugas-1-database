import { useRef, useState, useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

export const DefaultMarker = ({ isDraggable, position, setPosition, onAddLocation }) => {
	const defaultIcon = new L.Icon({
		iconUrl: require("../../assets/icons/joe.gif"),
		iconSize: new L.Point(65, 50),
	});
	// position state
	const [draggable] = useState(isDraggable !== undefined ? isDraggable : true);
	const markerRef = useRef(null);
	const popupRef = useRef(null);
	// handler untuk drag
	const eventHandlers = useMemo(
		() => ({
			dragend() {
				const marker = markerRef.current;
				if (marker != null && setPosition) {
					setPosition(marker.getLatLng());
				}
			},
		}),
		[setPosition]
	);
	// event pada saat tombol pop up diklick
	const onPopUpButtonClick = () => {
		if (onAddLocation && setPosition) {
			onAddLocation(position);
			setPosition({ lat: position.lat - 0.005, lng: position.lng + 0.005 });
			popupRef.current.close();
		}
	};

	// jsx
	return (
		<Marker icon={defaultIcon} draggable={draggable} eventHandlers={eventHandlers} position={position} ref={markerRef}>
			<Popup minWidth={90} ref={popupRef}>
				<button onClick={onPopUpButtonClick}>Tambahkan lokasi</button>
			</Popup>
		</Marker>
	);
};

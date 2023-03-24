import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { pb } from "../../repository/pocketbase";
import { useRef, useState, useMemo } from "react";

export function StaticMarker({ position, data }) {
	// state
	const [positionState, setPositionState] = useState(position);
	const [name, setName] = useState(data.nama);
	const [tipe, setTipe] = useState(data.tipe);
	const [detail, setDetail] = useState(data.detail);
	const markerRef = useRef(null);
	// icon
	const defaultIcon = new L.Icon({
		iconUrl: require("../../assets/icons/rumah.png"),
		iconSize: new L.Point(40, 40),
	});
	const tokoIcon = new L.Icon({
		iconUrl: require("../../assets/icons/gedung.png"),
		iconSize: new L.Point(40, 40),
	});
	const kantorIcon = new L.Icon({
		iconUrl: require("../../assets/icons/kantor.png"),
		iconSize: new L.Point(40, 40),
	});
	// event
	const onPopUpButtonClick = async () => {
		await pb.collection("positions").delete(data.id);
	};
	const onPopUpUpdate = async () => {
		await pb.collection("positions").update(data.id, {
			name,
			type: tipe,
			detail,
		});
	};
	const eventHandlers = useMemo(
		() => ({
			async dragend() {
				const marker = markerRef.current;
				await pb.collection("positions").update(data.id, {
					position: marker.getLatLng(),
				});
				setPositionState(marker.getLatLng());
				marker.openPopup();
			},
		}),
		[data]
	);

	// jsx
	return (
		<Marker
			ref={markerRef}
			position={positionState}
			eventHandlers={eventHandlers}
			draggable={true}
			icon={
				data.tipe === "kantor"
					? kantorIcon
					: data.tipe === "toko"
					? tokoIcon
					: defaultIcon
			}
		>
			<Popup minWidth={90}>
				<div className="flex mb-5">
					<span className="text-xs">{`[${positionState.lat} , ${positionState.lng}]`}</span>
				</div>
				<div className="flex flex-col mb-1">
					<div className="flex">
						<span className="font-bold mr-1">Nama : </span>
						<input
							className="mb-1 ml-2 border border-blue-500 rounded-md px-2"
							type="text"
							id="alamat_detail"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>
				</div>
				<div className="flex flex-col mb-1">
					<div className="flex">
						<span className="font-bold mr-1">Tipe : </span>
						<select
							className="mb-1 rounded-md px-2 py-1 ml-2"
							name=""
							id="tipe"
							onChange={(e) => setTipe(e.target.value)}
							defaultValue={data.tipe}
						>
							<option value="rumah">Rumah</option>
							<option value="kantor">Kantor</option>
							<option value="toko">Toko</option>
						</select>
					</div>
				</div>
				<div className="flex flex-col mb-1">
					<div className="flex">
						<span className="font-bold mr-1">Detail : </span>
						<input
							className="mb-1 ml-2 border border-blue-500 rounded-md px-2"
							type="text"
							id="alamat_detail"
							value={detail}
							onChange={(e) => setDetail(e.target.value)}
							required
						/>
					</div>
				</div>
				<div className="mt-5 flex flex-col">
					<button
						className="bg-green-500 py-1 rounded-md w-full text-white mb-2"
						onClick={onPopUpUpdate}
					>
						Update
					</button>
					<button
						className="bg-red-500 py-1 rounded-md w-full text-white"
						onClick={onPopUpButtonClick}
					>
						Hapus Lokasi
					</button>
				</div>
			</Popup>
		</Marker>
	);
}

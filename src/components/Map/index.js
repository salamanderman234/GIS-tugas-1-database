import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { pb } from "../../repository/pocketbase";
import { StaticMarker } from "../Marker/static";
import { AddPositionModal } from "../Modal/map";

export const Map = ({ startPosition }) => {
	const defaultMarkerPosition = startPosition || {
		lat: -8.670458,
		lng: 115.212631,
	};
	// state
	const [positionList, setPositionList] = useState([]);
	const [viewModal, setViewModal] = useState(false);
	const [modalPosition, setModalPosition] = useState(defaultMarkerPosition);
	// mount dan unmount
	useEffect(() => {
		const getDatas = async () => {
			const result = await pb.collection("positions").getList(1, 100, {
				sort: "created",
				$autoCancel: false,
			});
			setPositionList(result.items);
		};
		getDatas();
		let unsub = () => {};
		const subscribe = async () => {
			unsub = await pb
				.collection("positions")
				.subscribe("*", async ({ action, record }) => {
					if (action === "create") {
						setPositionList((positionList) => [
							...positionList,
							record,
						]);
					}
					if (action === "update") {
						setPositionList((positionList) =>
							positionList.map((element) =>
								element.id === record.id ? record : element
							)
						);
					}
					if (action === "delete") {
						setPositionList((positionList) =>
							positionList.filter(
								(value) => value.id !== record.id
							)
						);
					}
				});
		};
		subscribe();

		return () => {
			unsub();
		};
	}, []);

	// event
	const toggleModal = () => {
		setViewModal(!viewModal);
	};
	const MyMap = () => {
		useMapEvents({
			click: (e) => {
				toggleModal();
				setModalPosition(e.latlng);
			},
		});
		return null;
	};

	// mapping semua posisi yang tersimpan ke bentuk marker
	const positionListMap = positionList.map((element) => {
		const data = {
			id: element.id,
			nama: element.name,
			tipe: element.type,
			detail: element.detail,
		};
		return (
			<StaticMarker
				key={element.id}
				position={element.position}
				data={data}
			/>
		);
	});
	// jsx
	return (
		<>
			{viewModal && (
				<AddPositionModal
					position={modalPosition}
					onClose={toggleModal}
				/>
			)}
			<MapContainer
				className="z-0"
				center={defaultMarkerPosition}
				zoom={12}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{positionListMap}
				{/* event handler */}
				<MyMap />
			</MapContainer>
		</>
	);
};

import { useState } from "react";
import { pb } from "../../repository/pocketbase";

export const AddPositionModal = ({ position, onClose }) => {
	const [nama, setNama] = useState("");
	const [tipe, setTipe] = useState("rumah");
	const [detailAlamat, setDetailAlamat] = useState("");

	const onSubmitEvent = async (e) => {
		e.preventDefault();
		const newData = {
			position,
			name: nama,
			type: tipe,
			detail: detailAlamat,
		};
		await pb.collection("positions").create(newData);
		onClose();
	};

	return (
		<>
			<div
				className="overlay h-screen w-screen absolute opacity-30 bg-slate-800 z-10"
				onClick={onClose}
			></div>
			<div className="modal-content bg-white rounded-md absolute z-30 center left-1/3 top-1/4 p-5">
				<div className="close-container flex justify-end mb-5">
					<button
						className="close bg-red-600 text-white px-3 py-1 rounded-md"
						onClick={onClose}
					>
						X
					</button>
				</div>
				<div className="latlng-info flex flex-col">
					<span className="mb-1">Latitude : {position.lat}</span>
					<span className="mb-1">Langitude : {position.lng}</span>
				</div>
				<form onSubmit={onSubmitEvent}>
					<div className="label-input">
						<label className="mb-1" htmlFor="">
							Nama Bangunan :
						</label>
						<input
							className="mb-1 ml-2 border border-blue-500 rounded-md"
							type="text"
							id="nama"
							onChange={(e) => setNama(e.target.value)}
							required
						/>
					</div>
					<div className="label-input">
						<label className="mb-1" htmlFor="">
							Tipe :
						</label>
						<select
							className="mb-1 rounded-md px-2 py-1 ml-2"
							name=""
							id="tipe"
							onChange={(e) => setTipe(e.target.value)}
						>
							<option value="rumah">Rumah</option>
							<option value="kantor">Kantor</option>
							<option value="toko">Toko</option>
						</select>
					</div>
					<div className="label-input">
						<label className="mb-1" htmlFor="">
							Alamat Detail :
						</label>
						<input
							className="mb-1 ml-2 border border-blue-500 rounded-md"
							type="text"
							id="alamat_detail"
							onChange={(e) => setDetailAlamat(e.target.value)}
							required
						/>
					</div>
					<div className="flex justify-center mt-5">
						<button
							type="submit"
							className="submit w-full rounded-md bg-blue-500 text-white py-2"
						>
							Submit
						</button>
					</div>
				</form>
			</div>
		</>
	);
};

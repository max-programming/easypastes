export default function generateId(): string {
	let id = '';
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*abcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;

	for (let i = 0; i <= 11; i++)
		id += characters.charAt(Math.floor(Math.random() * charactersLength));

	return id;
}

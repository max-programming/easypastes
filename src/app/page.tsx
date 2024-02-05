import Link from "next/link";

export default function Home() {
	return (
		<>
			<div>Home page</div>
			<div className="flex gap-2">
				<Link href="/sign-in">Sign in</Link>
				<Link href="/sign-up">Sign up</Link>
				<Link href="/pastes/new">New Paste</Link>
			</div>
		</>
	);
}

import type { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
	return (
		<>
			<div className="container mx-auto max-w-screen-lg h-screen">
				<div className="flex justify-center items-center h-full">
					{children}
				</div>
			</div>
		</>
	);
}

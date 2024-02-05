"use client";

import { Label } from "@/components/ui/label";
import ReactCodeMirror, { EditorView } from "@uiw/react-codemirror";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { langs } from "@uiw/codemirror-extensions-langs";
import { useState } from "react";

const styleTheme = EditorView.baseTheme({
	"&.cm-editor.cm-focused": {
		outline: "none",
	},
});

export function CodeEditor() {
	const [code, setCode] = useState("const name = `Usman`;");

	return (
		<div className="container mx-auto max-w-screen-2xl mt-10">
			<Label htmlFor="code">Code:</Label>
			<ReactCodeMirror
				value={code}
				height="800px"
				className="text-base"
				theme={tokyoNight}
				extensions={[styleTheme, langs.tsx()]}
				onChange={(value) => {
					setCode(value);
				}}
			/>
		</div>
	);
}

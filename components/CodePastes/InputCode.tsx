import { Box, useColorModeValue } from "@chakra-ui/react";
import Highlight, { defaultProps, Language } from "prism-react-renderer";
import nightOwl from "prism-react-renderer/themes/nightOwl";
import nightOwlLight from "prism-react-renderer/themes/nightOwlLight";
import Editor from "react-simple-code-editor";
import { Dispatch, SetStateAction } from "react";
import { ILanguage } from "types";

interface Props {
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
  langauge?: ILanguage;
}

const InputCode = ({ code, setCode, langauge }: Props) => {
  const handleValueChange = (code: string) => setCode(code);
  const theme = useColorModeValue(nightOwlLight, nightOwl);
  const highlight = (code: string) => (
    <Highlight
      {...defaultProps}
      theme={theme}
      code={code}
      // @ts-ignore
      language={langauge || "diff"}
    >
      {({ tokens, getLineProps, getTokenProps }) => (
        <>
          {tokens.map((line, i) => (
            <Box {...getLineProps({ line, key: i })} key={i}>
              {line.map((token, key) => (
                <Box as="span" {...getTokenProps({ token, key })} key={key} />
              ))}
            </Box>
          ))}
        </>
      )}
    </Highlight>
  );
  return (
    <Box mt="4">
      <Editor
        value={code}
        onValueChange={handleValueChange}
        highlight={highlight}
        padding={10}
        placeholder="Paste code/text here"
        required
        // @ts-ignore
        style={{
          fontFamily: "monospace",
          boxSizing: "border-box",
          minHeight: 250,
          ...theme.plain,
        }}
      />
    </Box>
  );
};

export default InputCode;

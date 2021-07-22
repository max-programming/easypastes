import Highlight, { defaultProps, Language } from "prism-react-renderer";
import nightOwl from "prism-react-renderer/themes/nightOwl";
import nightOwlLight from "prism-react-renderer/themes/nightOwlLight";
import { Box, useColorModeValue } from "@chakra-ui/react";
import CopyButton from "./CopyButton";
import { ILanguage } from "types";

interface Props {
  code: string;
  language?: ILanguage;
}

const DisplayCode = ({ code, language }: Props) => {
  return (
    <Box mt="8" position="relative">
      <CopyButton code={code} />
      <Highlight
        {...defaultProps}
        code={code.trim()}
        // @ts-ignore
        language={language || "diff"}
        theme={useColorModeValue(nightOwlLight, nightOwl)}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <Box
            as="pre"
            className={className}
            style={style}
            textAlign="left"
            m="1em 0"
            p="0.5em"
            overflow="auto"
          >
            {tokens.map((line, i) => (
              <Box
                key={i}
                display="table-row"
                {...getLineProps({ line, key: i })}
              >
                <Box
                  as="span"
                  display="table-cell"
                  textAlign="right"
                  pr="1em"
                  userSelect="none"
                  opacity="0.5"
                >
                  {i + 1}
                </Box>
                <Box as="span" display="table-cell">
                  {line.map((token, key) => (
                    <Box
                      as="span"
                      key={key}
                      {...getTokenProps({ token, key })}
                    />
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Highlight>
    </Box>
  );
};

export default DisplayCode;

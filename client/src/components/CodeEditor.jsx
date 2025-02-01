import React, { useEffect, useState } from 'react'
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";

const CodeEditor = ({ setFileTree, saveFileTree, currentFile, fileTree }) => {

    const [code, setCode] = useState(fileTree[currentFile]?.file.contents || "");

    useEffect(() => {
        setCode(fileTree[currentFile]?.file.contents)
    }, [currentFile])

    const handleBlur = (e) => {
        const updatedContent = code;
        const ft = {
            ...fileTree,
            [currentFile]: {
                file: {
                    contents: updatedContent
                }
            }
        }
        setFileTree(ft)
        saveFileTree(ft)
    }

    return (
        <CodeMirror
            value={code}
            options={{
                mode: "javascript",
                theme: "material",
                lineNumbers: true,
                lineWrapping: true,
            }}
            onBeforeChange={(editor, data, value) => {
                setCode(value);
            }}
            onBlur={handleBlur}
        />
    )
}

export default CodeEditor









{/* <pre
    className="hljs h-full">
    <code
        className="hljs h-full outline-none"
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        dangerouslySetInnerHTML={{ __html: hljs.highlight('javascript', currFile?.file.contents).value }}
        style={{
            whiteSpace: 'pre-wrap',
            paddingBottom: '25rem',
            counterSet: 'line-numbering',
        }}
    />
</pre> */}
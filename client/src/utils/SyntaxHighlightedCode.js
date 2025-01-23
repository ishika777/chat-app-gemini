import React, { useEffect, useRef } from 'react'
import hljs from 'highlight.js';

export const SyntaxHighlightedCode = (props) => {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current && props.className?.includes('lang-')) {
            hljs.highlightElement(ref.current);

            // hljs won't reprocess the element unless this attribute is removed
            ref.current.removeAttribute('data-highlighted');
        }
    }, [props.className, props.children]);

    return <code {...props} ref={ref} />;
};
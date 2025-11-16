import React, { useState } from "react";
import { LinkExternal } from "../Links/Links";

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={copyToClipboard}
      className="absolute top-2 right-2 p-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200 opacity-0 group-hover:opacity-100"
      title={copied ? 'Copied!' : 'Copy code'}
    >
      {copied ? (
        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
};

const Pre = ({ children, ...props }) => {
  // Extract the code text from children
  const getCodeText = (children) => {
    if (typeof children === 'string') return children;
    if (children?.props?.children) {
      if (typeof children.props.children === 'string') {
        return children.props.children;
      }
      if (Array.isArray(children.props.children)) {
        return children.props.children.map(child => 
          typeof child === 'string' ? child : child?.props?.children || ''
        ).join('');
      }
    }
    return '';
  };

  const codeText = getCodeText(children);
  
  // Preserve original pre classes from Prism and merge with our custom classes
  const originalClassName = props.className || '';
  const preClasses = `code-block-wrapper-pre ${originalClassName}`.trim();

  return (
    <div className="code-block-wrapper group relative my-6">
      <pre {...props} className={preClasses}>
        {children}
        <CopyButton text={codeText} />
      </pre>
    </div>
  );
};

export const mdxComponents = {
  a: (props) => (
    <LinkExternal href={props.href}>{props.children}</LinkExternal>
  ),

  pre: Pre,

  Note: (props) => (
    <div className="mb-5 rounded border border-gray-200  bg-gray-50 p-4 text-sm [font-variation-settings:'opsz'_14] dark:border-neutral-800 dark:bg-neutral-900">
      {props.children}
    </div>
  ),
};

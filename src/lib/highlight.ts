import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';

hljs.registerLanguage('typescript', typescript);

/** Returns the TypeScript source as highlighted HTML (escaped by highlight.js). */
export function highlightTypeScript(source: string): string {
  return hljs.highlight(source, { language: 'typescript' }).value;
}

'use client';

import CodeMirror from '@uiw/react-codemirror';
import {EditorState} from '@codemirror/state';
import {EditorView} from '@codemirror/view';
import {indentUnit} from '@codemirror/language';
import {python} from '@codemirror/lang-python';

const extensions = [
  python(),
  indentUnit.of('    '),
  EditorState.tabSize.of(4),
  EditorView.lineWrapping,
  EditorView.contentAttributes.of({
    'aria-label': 'Python code editor',
    autocapitalize: 'off',
    autocorrect: 'off',
    spellcheck: 'false'
  })
];

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function CodeEditor({value, onChange}: CodeEditorProps) {
  return (
    <div className="bg-[#1e2530] text-sm">
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={extensions}
        theme="dark"
        height="224px"
        indentWithTab
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
          highlightActiveLineGutter: false,
          closeBrackets: true,
          indentOnInput: true,
          autocompletion: false
        }}
        style={{fontSize: '14px'}}
      />
      <p className="px-4 pb-2 text-[11px] text-white/50">
        Auto-close brackets · Python auto-indent · Tab / Shift+Tab to indent
      </p>
    </div>
  );
}

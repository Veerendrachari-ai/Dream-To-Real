// Code.jsx
import React from "react";

export default function Code({ code }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "100%",
      }}
    >
      {/* Code section */}
      <div style={{ flex: 1 }}>
        <h3>Generated HTML Code:</h3>
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            backgroundColor: "#1e1e1e",
            color: "#d4d4d4",
            maxHeight: "300px",
            overflowY: "auto",
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
          }}
        >
          <code>{code ? code : "// Generated code will appear here..."}</code>
        </div>
      </div>

      {/* Preview section */}
      <div style={{ flex: 1 }}>
        <h3>Live Preview:</h3>
        <iframe
          title="Preview"
          srcDoc={code}
          style={{
            width: "100%",
            height: "300px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        />
      </div>
    </div>
  );
}

import React from "react";

export function Input({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      className="ui-input"
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

export function Button({ children, onClick, disabled }) {
  return (
    <button className="ui-button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export function Card({ children }) {
  return <div className="ui-card">{children}</div>;
}

export function Grid({ children }) {
  return <div className="ui-grid">{children}</div>;
}
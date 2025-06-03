import { useState, useEffect } from "react";
import ProfileViewer from "./components/ProfileViewer";
import "./styles/main.css";

const API_BASE = "https://mcprofile.io/api/v1";
const API_KEY = "";

const identifierOptions = {
  java: [
    { value: "username", label: "Username" },
    { value: "uuid", label: "UUID" },
  ],
  bedrock: [
    { value: "gamertag", label: "Gamertag" },
    { value: "xuid", label: "XUID" },
    { value: "fuid", label: "Floodgate UUID" },
  ],
};

export default function App() {
  const [platform, setPlatform] = useState("java");
  const [identifierType, setIdentifierType] = useState("username");
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIdentifierType(identifierOptions[platform][0].value);
  }, [platform]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setResult(null);
    setError("");
    setLoading(true);

    try {
      const endpoint =
        platform === "bedrock" && identifierType === "gamertag"
          ? `bedrock/gamertag/${encodeURIComponent(input)}`
          : `${platform}/${identifierType}/${encodeURIComponent(input)}`;

      const res = await fetch(`${API_BASE}/${endpoint}`, {
        headers: API_KEY ? { "x-api-key": API_KEY } : {},
      });

      if (!res.ok)
        throw new Error(
          res.status === 404 ? "Account not found" : "API Error - Please try again"
        );

      setResult(await res.json());
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <form onSubmit={handleSearch} className="search-form">
        <div className="platform-selectors">
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="platform-select"
          >
            <option value="java">Java</option>
            <option value="bedrock">Bedrock</option>
          </select>

          <select
            value={identifierType}
            onChange={(e) => setIdentifierType(e.target.value)}
            className="identifier-select"
          >
            {identifierOptions[platform].map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="search-input">
          <input
            type="text"
            placeholder={
              identifierType === "username"
                ? "Username"
                : identifierType.toUpperCase()
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" disabled={loading || !input}>
            {loading ? <div className="spinner" /> : "Search"}
          </button>
        </div>
      </form>

      <div className="results-container">
        {error && <div className="error-message">{error}</div>}
        {result ? (
          <ProfileViewer platform={platform} result={result} />
        ) : (
          <div className="placeholder">
            Search for Minecraft accounts by any identifier
          </div>
        )}
      </div>
    </div>
  );
}

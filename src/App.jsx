import React, { useState } from "react";

// Optional: Insert your API key here if required by mcprofile.io
const API_KEY = ""; // e.g. "your-api-key"

const API_BASE = "https://mcprofile.io/api/v1";

const identifierOptions = {
  java: [
    { value: "username", label: "Username" },
    { value: "uuid", label: "UUID" },
  ],
  bedrock: [
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

  // Update identifier type if platform changes
  React.useEffect(() => {
    setIdentifierType(identifierOptions[platform][0].value);
  }, [platform]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setResult(null);
    setError("");
    setLoading(true);

    let url = "";
    if (platform === "java") {
      url = `${API_BASE}/java/${identifierType}/${encodeURIComponent(input)}`;
    } else {
      url = `${API_BASE}/bedrock/${identifierType}/${encodeURIComponent(input)}`;
    }

    try {
      const res = await fetch(url, {
        headers: API_KEY ? { "x-api-key": API_KEY } : {},
      });
      if (!res.ok) throw new Error("User not found or invalid API key.");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Helper to render linked account info
  const renderLinked = () => {
    if (!result) return null;
    if (platform === "java" && result.linked && result.bedrock_gamertag) {
      return (
        <div style={{ marginTop: 12 }}>
          <b>Linked Bedrock Account:</b>
          <div>Gamertag: {result.bedrock_gamertag}</div>
          <div>XUID: {result.bedrock_xuid}</div>
          <div>FUID: {result.bedrock_fuid}</div>
        </div>
      );
    }
    if (platform === "bedrock" && result.linked && result.java_name) {
      return (
        <div style={{ marginTop: 12 }}>
          <b>Linked Java Account:</b>
          <div>Username: {result.java_name}</div>
          <div>UUID: {result.java_uuid}</div>
        </div>
      );
    }
    return null;
  };

  // Helper to render main profile info
  const renderProfile = () => {
    if (!result) return null;
    if (platform === "java") {
      return (
        <>
          <div>
            <b>Username:</b> {result.username}
          </div>
          <div>
            <b>UUID:</b> <span style={{ fontFamily: "monospace" }}>{result.uuid}</span>
          </div>
          {result.skin && (
            <div>
              <b>Skin:</b>
              <br />
              <img
                src={result.skin}
                alt="Skin"
                style={{ width: 64, height: 128, marginTop: 4 }}
                onError={e => { e.currentTarget.src = '/default_skin.png'; }}
              />
            </div>
          )}
          {result.cape && (
            <div>
              <b>Cape:</b>
              <br />
              <img src={result.cape} alt="Cape" style={{ width: 64, height: 32, marginTop: 4 }} />
            </div>
          )}
          {renderLinked()}
        </>
      );
    }
    if (platform === "bedrock") {
      return (
        <>
          <div>
            <b>Gamertag:</b> {result.gamertag}
          </div>
          <div>
            <b>XUID:</b> <span style={{ fontFamily: "monospace" }}>{result.xuid}</span>
          </div>
          <div>
            <b>Floodgate UUID:</b> <span style={{ fontFamily: "monospace" }}>{result.floodgateuid}</span>
          </div>
          <div>
            <b>Gamescore:</b> {result.gamescore}
          </div>
          <div>
            <b>Account Tier:</b> {result.accounttier}
          </div>
          {result.icon && (
            <div>
              <b>Icon:</b>
              <br />
              <img src={result.icon} alt="Icon" style={{ width: 64, height: 64, marginTop: 4 }} />
            </div>
          )}
          {result.skin && (
            <div>
              <b>Skin:</b>
              <br />
              <img
                src={result.skin}
                alt="Skin"
                style={{ width: 64, height: 128, marginTop: 4 }}
                onError={e => { e.currentTarget.src = '/default_skin.png'; }}
              />
            </div>
          )}
          {renderLinked()}
        </>
      );
    }
    return null;
  };

  return (
    <div style={{
      maxWidth: 480,
      margin: "40px auto",
      fontFamily: "system-ui, sans-serif",
      background: "#fafbfc",
      borderRadius: 16,
      boxShadow: "0 4px 24px #0001",
      padding: 32,
    }}>
      <form onSubmit={handleSearch} style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <select
          value={platform}
          onChange={e => setPlatform(e.target.value)}
          style={{ padding: 8, borderRadius: 6, border: "1px solid #bbb" }}
        >
          <option value="java">Java</option>
          <option value="bedrock">Bedrock</option>
        </select>
        <select
          value={identifierType}
          onChange={e => setIdentifierType(e.target.value)}
          style={{ padding: 8, borderRadius: 6, border: "1px solid #bbb" }}
        >
          {identifierOptions[platform].map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder={identifierType === "username" ? "Username" : identifierType.toUpperCase()}
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ flex: 1, padding: 10, borderRadius: 6, border: "1px solid #bbb" }}
        />
        <button type="submit" disabled={loading || !input} style={{ padding: "0 20px" }}>
          {loading ? "Loading..." : "Search"}
        </button>
      </form>
      <div style={{ minHeight: 200 }}>
        {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
        {result && (
          <div style={{ background: "#fff", borderRadius: 10, padding: 18, boxShadow: "0 2px 8px #0001" }}>
            {renderProfile()}
          </div>
        )}
        {!result && !error && (
          <div style={{ color: "#888" }}>Enter a username, UUID, XUID, or FUID and select the correct platform and type.</div>
        )}
      </div>
    </div>
  );
}

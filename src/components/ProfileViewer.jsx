import { useState } from "react";
import Skinview3d from "react-skinview3d";
import DetailItem from "./DetailItem";
import LinkedAccount from "./LinkedAccount";

export default function ProfileViewer({ platform, result }) {
  const [viewMode, setViewMode] = useState("3d");

  if (!result) return null;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>{platform === "java" ? result.username : result.gamertag}</h2>
        {result.icon && (
          <img src={result.icon} alt="Avatar" className="profile-avatar" />
        )}
      </div>

      <div className="profile-details">
        <div className="detail-group">
          <h3>Account Info</h3>
          {platform === "bedrock" && (
            <>
              <DetailItem label="XUID" value={result.xuid} />
              <DetailItem label="Floodgate UUID" value={result.floodgateuid} />
              <DetailItem label="Game Score" value={result.gamescore} />
              <DetailItem label="Account Tier" value={result.accounttier} />
            </>
          )}
          {platform === "java" && (
            <>
              <DetailItem label="UUID" value={result.uuid} />
              {result.cape && (
                <DetailItem
                  label="Cape"
                  value={
                    <img
                      src={result.cape}
                      alt="Cape"
                      className="cape-image"
                      style={{ width: 128, height: 64, imageRendering: "pixelated" }}
                    />
                  }
                />
              )}
            </>
          )}
        </div>

        <div className="skin-viewer">
          <div className="view-mode-toggle">
            <button
              onClick={() => setViewMode("3d")}
              className={viewMode === "3d" ? "active" : ""}
            >
              3D View
            </button>
            <button
              onClick={() => setViewMode("2d")}
              className={viewMode === "2d" ? "active" : ""}
            >
              2D Skin
            </button>
          </div>

          {result.skin && (
            viewMode === "3d" ? (
              <Skinview3d
                skinUrl={result.skin}
                width={320}
                height={480}
                className="skin-3d"
              />
            ) : (
              <img
                src={result.skin}
                alt="Skin"
                className="skin-2d"
                style={{ width: 256, height: 512, imageRendering: "pixelated" }}
                onError={e => { e.currentTarget.src = '/default_skin.png'; }}
              />
            )
          )}
        </div>
      </div>

      {result.linked && <LinkedAccount platform={platform} result={result} />}
    </div>
  );
}

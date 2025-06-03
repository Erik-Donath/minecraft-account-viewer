import DetailItem from "./DetailItem";

export default function LinkedAccount({ platform, result }) {
  return (
    <div className="linked-account">
      <h3>
        Linked {platform === "java" ? "Bedrock" : "Java"} Account
      </h3>
      {platform === "java" ? (
        <>
          <DetailItem label="Gamertag" value={result.bedrock_gamertag} />
          <DetailItem label="XUID" value={result.bedrock_xuid} />
        </>
      ) : (
        <>
          <DetailItem label="Username" value={result.java_name} />
          <DetailItem label="UUID" value={result.java_uuid} />
        </>
      )}
    </div>
  );
}

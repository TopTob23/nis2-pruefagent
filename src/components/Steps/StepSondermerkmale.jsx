import { COLORS } from "../../constants/branding";
import { SONDERMERKMALE } from "../../constants/sectors";
import Chip from "../UI/Chip";

export default function StepSondermerkmale({ data, setField, toggleArrayItem }) {
  return (
    <div className="cd">
      <h2 style={{ fontSize: 18, fontWeight: 600, color: COLORS.TD, marginBottom: 4 }}>
        Größenunabhängige Sondermerkmale
      </h2>
      <p style={{ fontSize: 13, color: "#7a9ca5", marginBottom: 24 }}>
        NIS-2-Pflicht unabhängig von Unternehmensgröße
      </p>
      <div style={{ display: "grid", gap: 10 }}>
        {SONDERMERKMALE.map((x) => (
          <Chip
            key={x.id}
            active={data.sondermerkmale.includes(x.id)}
            variant="remove"
            onClick={() => {
              toggleArrayItem("sondermerkmale", x.id);
              setField("keinesSonder", false);
            }}
          >
            {x.l}
          </Chip>
        ))}
        <div
          style={{ borderTop: `1px solid ${COLORS.TM}`, paddingTop: 12, marginTop: 6 }}
        >
          <Chip
            active={data.keinesSonder}
            onClick={() => {
              setField("keinesSonder", !data.keinesSonder);
              setField("sondermerkmale", []);
            }}
          >
            Keines der genannten Merkmale
          </Chip>
        </div>
      </div>
    </div>
  );
}

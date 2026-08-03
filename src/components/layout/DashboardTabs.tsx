import Icon from "../ui/Icon";
import type { Dashboard } from "../../types";

export interface DashboardTabsProps {
  dashboards: Dashboard[];
  activeId: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
}

export default function DashboardTabs({ dashboards, activeId, onSelect, onCreate }: DashboardTabsProps) {
  return (
    <div className="sv-tabbar">
      <div className="sv-tabs">
        {dashboards.map((dash) => (
          <button
            key={dash.id}
            type="button"
            className={"sv-tab" + (dash.id === activeId ? " sv-tab--active" : "")}
            onClick={() => onSelect(dash.id)}
          >
            {dash.name}
          </button>
        ))}
      </div>
      <button type="button" className="sv-tab-add" onClick={onCreate} title="New dashboard">
        <Icon name="plus" size={16} color="var(--sa-fg-secondary)" />
      </button>
    </div>
  );
}

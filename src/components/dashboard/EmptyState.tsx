import Icon from "../ui/Icon";

const RING_RADII = [47.5, 79.5, 111.5, 143.5, 175.5, 207.5, 239.5];
const RING_COLORS = ["#E9EAEB", "#E9EAEB", "#E9EAEB", "#E9EAEB", "#ECEDEE", "#F3F4F5", "#F8F9FA"];

export interface EmptyStateProps {
  onAdd: () => void;
}

export default function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="relative w-[512px] flex flex-col gap-6 items-center">
        <svg
          width="480"
          height="480"
          viewBox="0 0 480 480"
          fill="none"
          className="absolute left-4 top-[-152px] pointer-events-none"
          aria-hidden="true"
        >
          {RING_RADII.map((r, i) => (
            <circle key={r} cx="240" cy="240" r={r} stroke={RING_COLORS[i]} />
          ))}
        </svg>
        <div className="relative flex flex-col gap-4 items-center">
          <Icon name="folderOpen" size={24} color="var(--sa-fg-secondary)" />
          <div className="max-w-[352px] flex flex-col gap-1 text-center">
            <span className="text-base font-semibold leading-6 text-black">Add Widgets</span>
            <span className="text-sm leading-5 text-grey-700">
              Click 'Add Widget' to start building your dashboards by adding Action, KPIs and Chart widgets!
            </span>
          </div>
        </div>
        <button type="button" className="sv-btn sv-btn--primary sv-btn--cta" onClick={onAdd}>
          Add Widgets
        </button>
      </div>
    </div>
  );
}

import React from "react";
import Icon from "../ui/Icon.jsx";

export default function EmptyState({onAdd}) {
    return (
        <div className="empty-canvas flex items-center justify-center">
            <div className="relative w-[512px] flex flex-col gap-6 items-center">

                <img className="empty-canvas_bg" src="../../../assets/bg_dots.png" alt="Grided_Background"/>
                <div className="empty-canvas_content absolute items-center flex flex-col gap-4">
                    <div className="relative flex flex-col gap-4 items-center">
                        <Icon name="folderOpen" size={24} color="var(--sa-fg-secondary)"/>
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
            <img className="empty-canvas_focus_graphics" src="../../../assets/focus_graphics_1.png" alt="Focus_graphics"/>

        </div>
    );
}

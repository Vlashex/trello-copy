import {
  DropDown,
  DropDownButton,
  DropDownContent,
  DropDownItem,
} from "@/shared/ui-kit/DropDown";
import React from "react";

type TaskUIProps = {
  id: number;
  content: string;
};

export default function TaskUI({ id, content }: TaskUIProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-blue-400">Task</span>
        <DropDown
          onToggle={() => {}}
          onStateChange={() => {}}
          initialOpen={true}
          closeOnOutsideClick={false}
          className="relative w-fit"
        >
          <DropDownButton className="custom-button w-full">⋮</DropDownButton>
          <DropDownContent
            position="bottom"
            align="end"
            width="fit"
            className="custom-content text-nowrap absolute -left-16"
          >
            <DropDownItem onSelect={() => console.log("Edit clicked")}>
              Edit Task
            </DropDownItem>
            <DropDownItem disabled>Delete Task</DropDownItem>
            <DropDownItem onClick={(e) => e.preventDefault()}>
              Share Task
            </DropDownItem>
          </DropDownContent>
        </DropDown>
      </div>
      <h4 className="mb-2 text-white">Task {id}</h4>
      <p className="text-sm text-gray-400">{content}</p>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex -space-x-2">{/* Placeholder for avatars */}</div>
        <div className="text-xs text-gray-400">2 days left</div>
      </div>
    </div>
  );
}

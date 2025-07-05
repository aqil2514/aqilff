"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export type TabOption = {
  label: string;
  value: string;
};

type TabSwitcherProps = {
  tabs: TabOption[];
};

export default function TabSwitcher({ tabs }: TabSwitcherProps) {
  return (
    <TabsList>
      {tabs.map((tab) => (
        <TabsTrigger key={tab.value} value={tab.value}>
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}

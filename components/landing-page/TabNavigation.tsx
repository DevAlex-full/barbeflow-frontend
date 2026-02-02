'use client';

import { LucideIcon } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export function TabNavigation({ tabs, activeTab, onChange }: TabNavigationProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                relative flex flex-col items-center gap-2 p-4 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg scale-105' 
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-102'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-semibold text-center leading-tight">
                {tab.label}
              </span>
              
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`
                  absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center
                  ${isActive ? 'bg-white text-purple-600' : 'bg-red-500 text-white'}
                `}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
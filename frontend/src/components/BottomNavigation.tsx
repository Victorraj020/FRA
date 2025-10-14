// import React from 'react';
// import { Button } from '@/components/ui/button';
// import { MapPin, BarChart3, Grid3X3, Bell } from 'lucide-react';
// import { cn } from '@/lib/utils';

// interface BottomNavigationProps {
//   activeTab: string;
//   onTabChange: (tab: string) => void;
// }

// const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
//   activeTab, 
//   onTabChange 
// }) => {
//   const tabs = [
//     { id: 'dashboard', label: 'Home', icon: Grid3X3 },
//     { id: 'map', label: 'Map', icon: MapPin },
//     { id: 'alerts', label: 'Alerts', icon: Bell },
//     { id: 'analytics', label: 'Analytics', icon: BarChart3 }
//   ];

//   return (
//     <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
//       <div className="flex items-center justify-center px-4 py-2">
//         <div className="flex items-center space-x-2 bg-white rounded-2xl p-2 shadow-lg border border-gray-200 max-w-sm w-full">
//           {tabs.map((tab) => {
//             const Icon = tab.icon;
//             const isActive = activeTab === tab.id;
            
//             return (
//               <Button
//                 key={tab.id}
//                 variant="ghost"
//                 onClick={() => onTabChange(tab.id)}
//                 className={cn(
//                   "flex-1 flex flex-col items-center justify-center h-14 rounded-xl font-medium transition-all duration-200 hover:scale-105",
//                   isActive 
//                     ? "bg-black text-white shadow-md hover:bg-gray-800" 
//                     : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
//                 )}
//               >
//                 <Icon className={cn(
//                   "w-5 h-5 mb-1",
//                   isActive ? "text-white" : "text-gray-600"
//                 )} />
//                 <span className={cn(
//                   "text-xs font-medium",
//                   isActive ? "text-white" : "text-gray-600"
//                 )}>{tab.label}</span>
//               </Button>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BottomNavigation;

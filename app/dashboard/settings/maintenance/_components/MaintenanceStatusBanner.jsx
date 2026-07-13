import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function MaintenanceStatusBanner({ settings }) {
  const isMaintenance = settings['maintenance']?.maintenanceMode;

  return (
    <div className={`p-4 rounded-xl border ${isMaintenance ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30' : 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30'} flex items-start gap-4`}>
      <div className={`p-2 rounded-lg ${isMaintenance ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400' : 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'}`}>
        {isMaintenance ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
      </div>
      <div>
        <h3 className={`font-bold ${isMaintenance ? 'text-orange-900 dark:text-orange-100' : 'text-green-900 dark:text-green-100'}`}>
          {isMaintenance ? 'Maintenance Mode is Active' : 'System is Live'}
        </h3>
        <p className={`text-sm mt-1 ${isMaintenance ? 'text-orange-800 dark:text-orange-200' : 'text-green-800 dark:text-green-200'}`}>
          {isMaintenance 
            ? 'All public traffic is currently being redirected to the maintenance page. The dashboard remains accessible.'
            : 'The public website is fully accessible to all visitors.'}
        </p>
      </div>
    </div>
  );
}

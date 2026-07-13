import React from 'react';
import { Database, Download, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function BackupSection({ 
  settings, 
  handleChange, 
  handleCreateBackup, 
  handleRestoreBackup, 
  backupMsg, 
  fileInputRef, 
  renderSaveButton 
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-6">
        <div className="flex gap-4">
          <Button type="button" onClick={handleCreateBackup} className="cursor-pointer bg-brand-600 hover:bg-brand-700 text-white flex-1 gap-2">
            <Database className="w-4 h-4" /> Create Local Backup
          </Button>
          <a href="/api/backup/download" download className="flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-medium dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white flex-1 transition-all">
            <Download className="w-4 h-4" /> Download Latest
          </a>
        </div>

        <div className="pt-2">
          <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleRestoreBackup} />
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="cursor-pointer w-full border-dashed border-2 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 gap-2">
            <Upload className="w-4 h-4" /> Upload & Restore Backup
          </Button>
          {backupMsg && <p className="text-sm mt-3 text-brand-600 dark:text-brand-400 text-center font-medium">{backupMsg}</p>}
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.backups?.automaticBackups || false}
              onChange={(e) => handleChange('backups', 'automaticBackups', e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Enable Automatic Backups</label>
          </div>
          {settings.backups?.automaticBackups && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Backup Schedule</label>
              <select
                value={settings.backups?.schedule || 'daily'}
                onChange={(e) => handleChange('backups', 'schedule', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/50 outline-none"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <p className="text-xs text-slate-500 mt-2">Note: Automatic backups require an external cron trigger to call your backup API endpoint.</p>
            </div>
          )}
        </div>
        {renderSaveButton()}
      </div>
    </div>
  );
}

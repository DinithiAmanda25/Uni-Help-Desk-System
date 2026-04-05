import { useState } from "react";
import { Settings, Save, ShieldCheck, Bell, BookOpen, DollarSign, Clock, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    finePerDay: 5,
    maxBorrowDays: 14,
    maxBooksPerStudent: 3,
    maxBooksPerLecturer: 10,
    renewalsAllowed: 2,
    reminderDaysBefore: 2,
    allowStudentUpload: false,
    requireApproval: true,
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: false,
    systemName: "UniLibraryHub",
    maxFileSize: 500,
    allowedTypes: ["PDF", "EPUB", "PPT", "DOC"],
  });

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  const toggle = (key) => setSettings({ ...settings, [key]: !settings[key] });
  const update = (key, val) => setSettings({ ...settings, [key]: val });

  const Toggle = ({ value, onChange }) => (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-all ${value ? "bg-amber-500" : "bg-gray-200"}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${value ? "left-5.5 translate-x-1" : "left-0.5"}`} />
    </button>
  );

  const Section = ({ title, icon: Icon, color, children }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={15} className="text-white" />
        </div>
        <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );

  const SettingRow = ({ label, desc, children }) => (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );

  const NumberInput = ({ value, onChange, min, max, unit }) => (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-20 px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-amber-300 text-center"
      />
      {unit && <span className="text-xs text-gray-400">{unit}</span>}
    </div>
  );

  return (
    <div className="px-6 py-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
          <p className="text-sm text-gray-400 mt-1">Configure fine rates, borrowing rules, and system behavior</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md text-sm">
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="space-y-5">
        {/* General */}
        <Section title="General Settings" icon={Settings} color="bg-slate-500">
          <SettingRow label="System Name" desc="Displayed in the header of all portals">
            <input value={settings.systemName} onChange={(e) => update("systemName", e.target.value)}
              className="w-44 px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-amber-300" />
          </SettingRow>
          <SettingRow label="Maintenance Mode" desc="Disable access for all users except admins">
            <Toggle value={settings.maintenanceMode} onChange={() => toggle("maintenanceMode")} />
          </SettingRow>
        </Section>

        {/* Fine & Borrowing Rules */}
        <Section title="Fine & Borrowing Rules" icon={DollarSign} color="bg-amber-500">
          <SettingRow label="Fine per Overdue Day" desc="Charged for each day a book is overdue">
            <NumberInput value={settings.finePerDay} onChange={(v) => update("finePerDay", v)} min={1} max={100} unit="₹/day" />
          </SettingRow>
          <SettingRow label="Default Borrow Duration" desc="Standard loan period for students">
            <NumberInput value={settings.maxBorrowDays} onChange={(v) => update("maxBorrowDays", v)} min={3} max={60} unit="days" />
          </SettingRow>
          <SettingRow label="Max Books per Student" desc="Maximum concurrent active loans">
            <NumberInput value={settings.maxBooksPerStudent} onChange={(v) => update("maxBooksPerStudent", v)} min={1} max={10} unit="books" />
          </SettingRow>
          <SettingRow label="Max Books per Lecturer">
            <NumberInput value={settings.maxBooksPerLecturer} onChange={(v) => update("maxBooksPerLecturer", v)} min={1} max={30} unit="books" />
          </SettingRow>
          <SettingRow label="Renewals Allowed" desc="How many times a loan can be extended">
            <NumberInput value={settings.renewalsAllowed} onChange={(v) => update("renewalsAllowed", v)} min={0} max={5} unit="times" />
          </SettingRow>
        </Section>

        {/* Notifications */}
        <Section title="Notification Settings" icon={Bell} color="bg-blue-500">
          <SettingRow label="Due Date Reminder" desc="Days before due date to send reminder">
            <NumberInput value={settings.reminderDaysBefore} onChange={(v) => update("reminderDaysBefore", v)} min={1} max={7} unit="days before" />
          </SettingRow>
          <SettingRow label="Email Notifications" desc="Send email alerts for due dates and updates">
            <Toggle value={settings.emailNotifications} onChange={() => toggle("emailNotifications")} />
          </SettingRow>
          <SettingRow label="SMS Notifications" desc="Send SMS alerts for urgent due dates">
            <Toggle value={settings.smsNotifications} onChange={() => toggle("smsNotifications")} />
          </SettingRow>
        </Section>

        {/* Resource Settings */}
        <Section title="Resource Settings" icon={BookOpen} color="bg-violet-500">
          <SettingRow label="Allow Student Uploads" desc="Let students upload resources (requires approval)">
            <Toggle value={settings.allowStudentUpload} onChange={() => toggle("allowStudentUpload")} />
          </SettingRow>
          <SettingRow label="Require Admin Approval" desc="All uploads need approval before publishing">
            <Toggle value={settings.requireApproval} onChange={() => toggle("requireApproval")} />
          </SettingRow>
          <SettingRow label="Max File Size" desc="Maximum upload size per file">
            <NumberInput value={settings.maxFileSize} onChange={(v) => update("maxFileSize", v)} min={10} max={2000} unit="MB" />
          </SettingRow>
        </Section>

        {/* Warning banner */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Caution: Changes Impact All Users</p>
            <p className="text-xs mt-0.5">Fine and borrowing rule changes apply immediately to all active loans. Please review carefully before saving.</p>
          </div>
        </div>

        <button onClick={handleSave} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
          <Save size={18} /> Save All Settings
        </button>
      </div>
    </div>
  );
}

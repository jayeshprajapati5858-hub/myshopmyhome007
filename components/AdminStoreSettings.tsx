import React, { useState } from "react";
import { AlertTriangle, BookOpen, CheckCircle2, Save, Settings } from "lucide-react";
import { BuyingGuide, StoreSettings } from "../types";
import { saveBuyingGuideToFirebase, saveStoreSettingsToFirebase } from "../services/firebase";

export const AdminStoreSettingsTab: React.FC<{
  settings: StoreSettings;
  setSettings: React.Dispatch<React.SetStateAction<StoreSettings>>;
  guides: BuyingGuide[];
  setGuides: React.Dispatch<React.SetStateAction<BuyingGuide[]>>;
}> = ({ settings, setSettings, guides, setGuides }) => {
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editingGuide, setEditingGuide] = useState<BuyingGuide | null>(null);
  const [savingGuide, setSavingGuide] = useState(false);

  const missingOwnerFields: string[] = [];
  if (!settings.supportEmail?.trim()) missingOwnerFields.push("Support Email Address");
  if (!settings.supportPhone?.trim()) missingOwnerFields.push("Support Phone / WhatsApp Number");
  if (!settings.businessAddress?.trim()) missingOwnerFields.push("Physical Business / Store Address");
  if (!settings.businessHours?.trim()) missingOwnerFields.push("Customer Support Hours");
  if (!settings.shippingSummary?.trim()) missingOwnerFields.push("Shipping Charges & Coverage Summary");
  if (!settings.deliveryTimeline?.trim()) missingOwnerFields.push("Estimated Delivery Timeline");
  if (!settings.refundTimeline?.trim()) missingOwnerFields.push("Refund Processing Timeline");
  if (!settings.warrantySummary?.trim()) missingOwnerFields.push("Warranty Terms Summary");

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSaveSuccess(false);
    try {
      const saved = await saveStoreSettingsToFirebase(settings);
      setSettings(saved as StoreSettings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save store settings:", err);
      alert("Failed to save store settings. Please check your connection.");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuide) return;
    setSavingGuide(true);
    try {
      const updated: BuyingGuide = {
        ...editingGuide,
        updatedAt: new Date().toISOString().split("T")[0],
      };
      await saveBuyingGuideToFirebase(updated);
      setGuides((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
      setEditingGuide(null);
    } catch (err) {
      console.error("Failed to save guide:", err);
      alert("Failed to save buying guide.");
    } finally {
      setSavingGuide(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Missing Owner Input Checklist */}
      {missingOwnerFields.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={22} />
            <div>
              <h3 className="font-bold text-amber-900 text-base mb-1">
                Owner Action Needed: Verified Business Details Missing ({missingOwnerFields.length})
              </h3>
              <p className="text-xs text-amber-800 mb-3">
                To keep your public policy pages accurate and trustworthy (without publishing made-up contact or policy promises), please enter your real business information below:
              </p>
              <div className="flex flex-wrap gap-2">
                {missingOwnerFields.map((field) => (
                  <span
                    key={field}
                    className="px-2.5 py-1 bg-white border border-amber-200 rounded-lg text-xs font-bold text-amber-900"
                  >
                    • {field}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Store & Policy Settings Form */}
      <form
        onSubmit={handleSaveSettings}
        className="bg-white p-6 md:p-8 rounded-[2rem] border shadow-sm space-y-6"
      >
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <Settings className="text-orange-600" size={22} />
            <h3 className="text-xl font-bold text-slate-900">
              Store Contact, Policy & AdSense Settings
            </h3>
          </div>
          {saveSuccess && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
              <CheckCircle2 size={14} /> Saved to Store
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Store / Brand Name
            </label>
            <input
              value={settings.businessName}
              onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
              className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-bold text-sm"
              placeholder="MyshopMyhome.shop"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Support Email Address {!settings.supportEmail?.trim() && <span className="text-amber-600">(Needs Owner Input)</span>}
            </label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-medium text-sm"
              placeholder="Enter official customer support email"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Support Phone / WhatsApp {!settings.supportPhone?.trim() && <span className="text-amber-600">(Needs Owner Input)</span>}
            </label>
            <input
              type="tel"
              value={settings.supportPhone}
              onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
              className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-medium text-sm"
              placeholder="Enter official customer support phone number"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Customer Support Hours {!settings.businessHours?.trim() && <span className="text-amber-600">(Needs Owner Input)</span>}
            </label>
            <input
              value={settings.businessHours}
              onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
              className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-medium text-sm"
              placeholder="e.g. Monday to Saturday, 10:00 AM – 6:00 PM"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Physical Store / Business Address {!settings.businessAddress?.trim() && <span className="text-amber-600">(Needs Owner Input)</span>}
            </label>
            <textarea
              value={settings.businessAddress}
              onChange={(e) => setSettings({ ...settings, businessAddress: e.target.value })}
              className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-medium text-sm h-20"
              placeholder="Enter verified shop / office address for Contact & About pages"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Shipping Charges & Coverage {!settings.shippingSummary?.trim() && <span className="text-amber-600">(Needs Owner Input)</span>}
            </label>
            <textarea
              value={settings.shippingSummary}
              onChange={(e) => setSettings({ ...settings, shippingSummary: e.target.value })}
              className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-medium text-sm h-24"
              placeholder="Describe shipping charges, free delivery thresholds, and serviceable areas"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Estimated Delivery Timeline {!settings.deliveryTimeline?.trim() && <span className="text-amber-600">(Needs Owner Input)</span>}
            </label>
            <textarea
              value={settings.deliveryTimeline}
              onChange={(e) => setSettings({ ...settings, deliveryTimeline: e.target.value })}
              className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-medium text-sm h-24"
              placeholder="Describe realistic dispatch and delivery timelines"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Return Eligibility Details
            </label>
            <textarea
              value={settings.returnPolicySummary}
              onChange={(e) => setSettings({ ...settings, returnPolicySummary: e.target.value })}
              className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-medium text-sm h-24"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Refund Processing Timeline {!settings.refundTimeline?.trim() && <span className="text-amber-600">(Needs Owner Input)</span>}
            </label>
            <textarea
              value={settings.refundTimeline}
              onChange={(e) => setSettings({ ...settings, refundTimeline: e.target.value })}
              className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-medium text-sm h-24"
              placeholder="Describe how and when approved refunds are credited"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Warranty Summary {!settings.warrantySummary?.trim() && <span className="text-amber-600">(Needs Owner Input)</span>}
            </label>
            <textarea
              value={settings.warrantySummary}
              onChange={(e) => setSettings({ ...settings, warrantySummary: e.target.value })}
              className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-medium text-sm h-20"
              placeholder="Describe applicable product warranty terms (leave blank if no blanket warranty applies)"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Business Registration / GST (Optional)
            </label>
            <textarea
              value={settings.registrationDetails}
              onChange={(e) => setSettings({ ...settings, registrationDetails: e.target.value })}
              className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-medium text-sm h-20"
              placeholder="Optional: Enter GSTIN or business registration number if applicable"
            />
          </div>
        </div>

        {/* AdSense Section */}
        <div className="pt-6 border-t space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                Editorial AdSlots (Disabled by Default)
              </h4>
              <p className="text-xs text-slate-500">
                Renders only on Buying Guides & FAQ pages when a valid <code>VITE_ADSENSE_CLIENT_ID</code> environment variable and Ad Slot ID are configured. Never shown on shopping, cart, or checkout flows.
              </p>
            </div>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(settings.adsenseEnabled)}
                onChange={(e) => setSettings({ ...settings, adsenseEnabled: e.target.checked })}
                className="w-4 h-4 accent-orange-600"
              />
              <span className="text-xs font-bold text-slate-700">Enable Editorial Ads</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                Buying Guides Ad Slot ID (Optional)
              </label>
              <input
                value={settings.adsenseGuideSlotId || ""}
                onChange={(e) => setSettings({ ...settings, adsenseGuideSlotId: e.target.value })}
                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono"
                placeholder="Numeric AdSense Slot ID (e.g. 1234567890)"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                FAQ Page Ad Slot ID (Optional)
              </label>
              <input
                value={settings.adsenseFaqSlotId || ""}
                onChange={(e) => setSettings({ ...settings, adsenseFaqSlotId: e.target.value })}
                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono"
                placeholder="Numeric AdSense Slot ID (e.g. 1234567890)"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={savingSettings}
            className="px-8 py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            <Save size={16} />
            {savingSettings ? "Saving Settings..." : "Save Store Settings"}
          </button>
        </div>
      </form>

      {/* Buying Guides Editor */}
      <div className="bg-white p-6 md:p-8 rounded-[2rem] border shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b pb-4">
          <BookOpen className="text-blue-600" size={22} />
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Buying Guides & Helpful Articles ({guides.length})
            </h3>
            <p className="text-xs text-slate-500">
              Edit the store’s buying guides published at <code>/buying-guides</code>.
            </p>
          </div>
        </div>

        {editingGuide ? (
          <form onSubmit={handleSaveGuide} className="space-y-4 bg-slate-50 p-6 rounded-2xl border">
            <h4 className="font-bold text-slate-900">Edit Guide: {editingGuide.title}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Title
                </label>
                <input
                  required
                  value={editingGuide.title}
                  onChange={(e) => setEditingGuide({ ...editingGuide, title: e.target.value })}
                  className="w-full p-3 bg-white rounded-xl border font-bold text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Category
                </label>
                <input
                  required
                  value={editingGuide.category}
                  onChange={(e) => setEditingGuide({ ...editingGuide, category: e.target.value })}
                  className="w-full p-3 bg-white rounded-xl border font-bold text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Summary
                </label>
                <textarea
                  required
                  value={editingGuide.summary}
                  onChange={(e) => setEditingGuide({ ...editingGuide, summary: e.target.value })}
                  className="w-full p-3 bg-white rounded-xl border text-sm h-20"
                />
              </div>
            </div>

            <div className="space-y-4">
              {editingGuide.sections.map((sec, idx) => (
                <div key={idx} className="p-4 bg-white rounded-xl border space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase">
                    Section {idx + 1} Heading
                  </label>
                  <input
                    required
                    value={sec.heading}
                    onChange={(e) => {
                      const updatedSecs = [...editingGuide.sections];
                      updatedSecs[idx] = { ...sec, heading: e.target.value };
                      setEditingGuide({ ...editingGuide, sections: updatedSecs });
                    }}
                    className="w-full p-2.5 bg-slate-50 rounded-lg border font-bold text-sm"
                  />
                  <label className="block text-xs font-bold text-slate-400 uppercase">
                    Section {idx + 1} Content
                  </label>
                  <textarea
                    required
                    value={sec.body}
                    onChange={(e) => {
                      const updatedSecs = [...editingGuide.sections];
                      updatedSecs[idx] = { ...sec, body: e.target.value };
                      setEditingGuide({ ...editingGuide, sections: updatedSecs });
                    }}
                    className="w-full p-2.5 bg-slate-50 rounded-lg border text-sm h-24"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingGuide(null)}
                className="px-5 py-2.5 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingGuide}
                className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700"
              >
                {savingGuide ? "Saving..." : "Save Guide"}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guides.map((g) => (
              <div
                key={g.id}
                className="p-4 rounded-xl border border-slate-200 flex flex-col justify-between gap-3"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase text-orange-600">
                    {g.category}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-0.5">{g.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{g.summary}</p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-[10px] text-slate-400">Updated: {g.updatedAt}</span>
                  <button
                    type="button"
                    onClick={() => setEditingGuide(g)}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Edit Content
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

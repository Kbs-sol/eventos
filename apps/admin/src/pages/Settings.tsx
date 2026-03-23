import { useState } from 'react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Toggle } from '../components/ui/Toggle'
import { Badge } from '../components/ui/Badge'
import { PageHeader } from '../components/ui/Shared'
import config from '@eventos/config'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general')

  const tabs = [
    { key: 'general', label: 'General', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    { key: 'brand', label: 'Brand', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
    { key: 'features', label: 'Features', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
    { key: 'env', label: 'Environment', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  ]

  return (
    <div>
      <PageHeader title="Settings" description="Configure your website and integrations" />

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 p-1 bg-gray-100 rounded-lg w-fit">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} /></svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* General tab */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Company Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Company Name</label><p className="text-sm text-gray-900 font-medium">{config.company.name}</p></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Tagline</label><p className="text-sm text-gray-900">{config.company.tagline}</p></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Email</label><p className="text-sm text-gray-900">{config.company.email}</p></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Phone</label><p className="text-sm text-gray-900">{config.company.phone}</p></div>
              <div className="sm:col-span-2"><label className="block text-xs font-medium text-gray-500 mb-1">Address</label><p className="text-sm text-gray-900">{config.company.address}</p></div>
            </div>
            <p className="text-xs text-gray-400 mt-4 pt-4 border-t">Edit these values in <code className="bg-gray-100 px-1 rounded">brand.config.ts</code></p>
          </Card>

          <Card>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Social Links</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.entries(config.social) as [string, string | undefined][]).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <span className="text-sm font-medium text-gray-600 capitalize w-24">{key}</span>
                  <span className="text-sm text-gray-900 flex-1 truncate">{value || <span className="text-gray-400 italic">Not set</span>}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Brand tab */}
      {activeTab === 'brand' && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Color Palette</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(Object.entries(config.brand.colors) as [string, string][]).map(([name, color]) => (
                <div key={name} className="text-center">
                  <div className="w-full aspect-square rounded-xl mb-2 border border-gray-200" style={{ backgroundColor: color }} />
                  <p className="text-xs font-medium text-gray-700 capitalize">{name.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <p className="text-[10px] text-gray-400 font-mono">{color}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Typography</h3>
            <div className="grid grid-cols-3 gap-6">
              {(Object.entries(config.brand.fonts) as [string, string][]).map(([type, font]) => font && (
                <div key={type}>
                  <p className="text-xs font-medium text-gray-500 mb-1 capitalize">{type}</p>
                  <p className="text-xl" style={{ fontFamily: `'${font}', sans-serif` }}>{font}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Layout & Style</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div><p className="text-xs font-medium text-gray-500 mb-1">Variant</p><Badge variant="primary">{config.brand.layout.variant}</Badge></div>
              <div><p className="text-xs font-medium text-gray-500 mb-1">Hero Style</p><Badge>{config.brand.layout.heroStyle}</Badge></div>
              <div><p className="text-xs font-medium text-gray-500 mb-1">Nav Style</p><Badge>{config.brand.layout.navStyle}</Badge></div>
              <div><p className="text-xs font-medium text-gray-500 mb-1">Animations</p><Badge>{config.brand.style.animationLevel}</Badge></div>
            </div>
          </Card>
        </div>
      )}

      {/* Features tab */}
      {activeTab === 'features' && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Feature Flags</h3>
            <div className="space-y-4">
              <Toggle checked={config.features.whatsapp.enabled} onChange={() => {}} label="WhatsApp Floating Button" description={`Number: ${config.features.whatsapp.number}`} />
              <Toggle checked={config.features.razorpay.enabled} onChange={() => {}} label="Razorpay Payments" description={config.features.razorpay.enabled ? `Deposit: ₹${config.features.razorpay.depositAmount}` : 'Enable to accept booking deposits'} />
              <Toggle checked={config.features.analytics} onChange={() => {}} label="Analytics" description="Track visitor behavior" />
              <Toggle checked={config.features.blog} onChange={() => {}} label="Blog" description="Enable blog section" />
              <Toggle checked={config.features.cookieBanner} onChange={() => {}} label="Cookie Banner" />
              <Toggle checked={config.features.darkModeToggle} onChange={() => {}} label="Dark Mode Toggle" />
            </div>
            <p className="text-xs text-gray-400 mt-4 pt-4 border-t">Feature flags are defined in <code className="bg-gray-100 px-1 rounded">brand.config.ts</code></p>
          </Card>
        </div>
      )}

      {/* Environment tab */}
      {activeTab === 'env' && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Required Environment Variables</h3>
            <div className="space-y-2">
              {[
                { key: 'SUPABASE_URL', desc: 'Supabase project URL', required: true },
                { key: 'SUPABASE_ANON_KEY', desc: 'Supabase anonymous key', required: true },
                { key: 'SUPABASE_SERVICE_ROLE_KEY', desc: 'Supabase service role key (API only)', required: true },
                { key: 'R2_BUCKET_NAME', desc: 'Cloudflare R2 bucket name', required: false },
                { key: 'R2_PUBLIC_URL', desc: 'Public URL for R2 assets', required: false },
                { key: 'RESEND_API_KEY', desc: 'Resend API key for emails', required: false },
                { key: 'RAZORPAY_KEY_ID', desc: 'Razorpay key ID', required: false },
              ].map(env => (
                <div key={env.key} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                  <code className="text-xs font-mono text-gray-900 flex-1">{env.key}</code>
                  <span className="text-xs text-gray-500 hidden sm:block">{env.desc}</span>
                  {env.required && <Badge variant="danger">Required</Badge>}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

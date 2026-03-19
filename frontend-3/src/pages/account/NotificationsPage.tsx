import { Card, Toggle, Button } from '../../components'
import { Bell, Mail, MessageSquare, Shield } from 'lucide-react'
import { useState } from 'react'

interface NotificationPrefs {
  email: boolean
  sms: boolean
  push: boolean
  marketing: boolean
  security: boolean
  bookingUpdates: boolean
}

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState<NotificationPrefs>({
    email: true,
    sms: true,
    push: true,
    marketing: false,
    security: true,
    bookingUpdates: true,
  })

  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Notification Preferences</h1>

      <Card>
        <h2 className="text-xl font-semibold mb-6">Notification Channels</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive updates via email</p>
              </div>
            </div>
            <Toggle
              checked={prefs.email}
              onChange={(checked) => setPrefs({ ...prefs, email: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium">SMS Notifications</p>
                <p className="text-sm text-gray-600">Receive text messages</p>
              </div>
            </div>
            <Toggle
              checked={prefs.sms}
              onChange={(checked) => setPrefs({ ...prefs, sms: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-600">Receive browser notifications</p>
              </div>
            </div>
            <Toggle
              checked={prefs.push}
              onChange={(checked) => setPrefs({ ...prefs, push: checked })}
            />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold mb-6">Notification Types</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium">Booking Updates</p>
              <p className="text-sm text-gray-600">Get notified about your bookings</p>
            </div>
            <Toggle
              checked={prefs.bookingUpdates}
              onChange={(checked) => setPrefs({ ...prefs, bookingUpdates: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium">Security Alerts</p>
                <p className="text-sm text-gray-600">Important account security alerts</p>
              </div>
            </div>
            <Toggle
              checked={prefs.security}
              onChange={(checked) => setPrefs({ ...prefs, security: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium">Marketing & Promotions</p>
              <p className="text-sm text-gray-600">Special offers and promotions</p>
            </div>
            <Toggle
              checked={prefs.marketing}
              onChange={(checked) => setPrefs({ ...prefs, marketing: checked })}
            />
          </div>
        </div>
      </Card>

      {isSaved && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          Preferences saved successfully!
        </div>
      )}

      <Button onClick={handleSave}>Save Preferences</Button>
    </div>
  )
}

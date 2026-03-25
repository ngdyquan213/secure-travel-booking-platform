import { useEffect, useState } from 'react'
import { Download, Ticket } from 'lucide-react'
import { apiClient } from '@/shared/api/apiClient'
import { formatDate } from '@/shared/lib/helpers'
import type { Booking } from '@/shared/types/api'

export function VouchersPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await apiClient.getUserBookings(50, 0)
        setBookings(response.bookings.filter((booking) => booking.booking_status !== 'CANCELLED'))
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load voucher candidates.')
      } finally {
        setLoading(false)
      }
    }

    void loadBookings()
  }, [])

  const handleDownload = async (booking: Booking) => {
    setDownloadingId(booking.id)
    setError('')

    try {
      const blob = await apiClient.downloadVoucherPdf(booking.id)
      const url = window.URL.createObjectURL(blob)
      const link = window.document.createElement('a')
      link.href = url
      link.download = `${booking.booking_code ?? booking.id}-voucher.pdf`
      window.document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : 'Voucher download failed.')
    } finally {
      setDownloadingId(null)
    }
  }

  if (loading) {
    return <div className="py-16 text-center text-gray-600">Loading voucher history...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">Voucher center</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Booking vouchers</h1>
        <p className="mt-2 text-gray-600">Download PDF vouchers for active bookings using the secured backend export endpoint.</p>
      </div>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {bookings.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
          <Ticket className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">No vouchers available yet</h2>
          <p className="mt-2 text-gray-600">Create or confirm a booking first, then return here to download the voucher.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between gap-4 rounded-3xl border border-gray-200 bg-white p-5">
              <div>
                <p className="font-semibold text-gray-900">{booking.booking_code ?? booking.id}</p>
                <p className="mt-1 text-sm text-gray-600">
                  {booking.booking_type} • {formatDate(booking.travel_date)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void handleDownload(booking)}
                disabled={downloadingId === booking.id}
                className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-3 font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Download className="h-4 w-4" />
                {downloadingId === booking.id ? 'Downloading...' : 'Download PDF'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

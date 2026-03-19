import { CreditCard, Plus, Send } from 'lucide-react'

export default function WalletPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Wallet</h2>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg shadow-lg p-8 text-white">
        <p className="text-sm opacity-90 mb-2">Available Balance</p>
        <h1 className="text-4xl font-bold mb-8">$0.00</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-medium">
            <Plus className="w-4 h-4" />
            Add Funds
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-primary-600 transition-colors font-medium">
            <Send className="w-4 h-4" />
            Transfer
          </button>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="text-center py-8 text-gray-500">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p>No transactions yet</p>
        </div>
      </div>
    </div>
  )
}

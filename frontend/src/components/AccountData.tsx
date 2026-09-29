import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { api } from '#/lib/api'

export default function AccountData() {
  const navigate = useNavigate()
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const handleExport = async () => {
    setError('')
    try {
      const data = await api.auth.exportData()
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'kalora-data.json'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setError('Export failed. Try again.')
    }
  }

  const handleDelete = async () => {
    setBusy(true)
    setError('')
    try {
      await api.auth.deleteAccount()
      navigate({ to: '/' })
    } catch {
      setError('Deletion failed. Try again or email support.')
      setBusy(false)
    }
  }

  return (
    <section
      aria-labelledby="account-data-heading"
      className="mt-16 bg-white rounded-[2.5rem] p-8 sm:p-10 border border-[#E2EEDB]"
    >
      <h3
        id="account-data-heading"
        className="text-xl font-extrabold text-[#173A27] tracking-tight"
      >
        Your data
      </h3>
      <p className="text-sm text-[#3B4A40] mt-2">
        Download everything we store about you, or permanently delete your
        account and all food logs.
      </p>
      <div className="flex flex-wrap gap-3 mt-6">
        <button
          type="button"
          onClick={handleExport}
          className="px-5 py-2.5 rounded-full border border-[#173A27] text-[#173A27] text-sm font-semibold hover:bg-[#F4F9F1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173A27]"
        >
          Export my data
        </button>
        {!confirming ? (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="px-5 py-2.5 rounded-full border border-red-700 text-red-700 text-sm font-semibold hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
          >
            Delete my account
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={handleDelete}
              disabled={busy}
              className="px-5 py-2.5 rounded-full bg-red-700 text-white text-sm font-semibold hover:bg-red-800 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
            >
              {busy ? 'Deleting…' : 'Confirm: delete permanently'}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={busy}
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-[#3B4A40] hover:bg-[#F4F9F1]"
            >
              Cancel
            </button>
          </>
        )}
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-700 mt-3">
          {error}
        </p>
      )}
    </section>
  )
}

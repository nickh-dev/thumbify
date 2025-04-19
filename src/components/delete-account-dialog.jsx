"use client"

import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'

export default function DeleteAccountDialog({ isOpen, onClose }) {
  const [confirmText, setConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState(null)
  const { deleteUser } = useAuth()
  const router = useRouter()

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm')
      return
    }

    setIsDeleting(true)
    setError(null)

    try {
      const { error } = await deleteUser()
      
      if (error) {
        throw error
      }

      // Redirect to home page after successful deletion
      router.push('/')
    } catch (error) {
      console.error('Error deleting account:', error)
      setError('Failed to delete account. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6">
          <Dialog.Title className="text-lg font-medium text-gray-900">
            Delete Account
          </Dialog.Title>
          
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </p>
            
            <div className="mt-4">
              <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
                Type DELETE to confirm
              </label>
              <input
                type="text"
                id="confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="DELETE"
              />
            </div>

            {error && (
              <p className="mt-2 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

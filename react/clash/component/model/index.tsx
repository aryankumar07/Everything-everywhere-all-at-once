interface ModalProps {
  open: boolean,
  isOpen: (open: boolean) => void
  title: string,
  secondaryButtonTitle: string,
  secondaryAction: () => void,
  children: React.ReactNode
}

const Modal = ({
  open,
  isOpen,
  title,
  secondaryButtonTitle,
  secondaryAction,
  children
}: ModalProps) => {
  if (!open) {
    return null
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 dark:bg-zinc-900 dark:shadow-black/40">
        <div className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">{title}</div>
        {children}
        <div className="flex flex-row justify-end gap-3 mt-6">
          <button
            onClick={() => isOpen(false)}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors dark:border-zinc-600 dark:text-gray-200 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            onClick={secondaryAction}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            {secondaryButtonTitle}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal

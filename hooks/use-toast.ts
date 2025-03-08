// This is based on the shadcn/ui toast implementation
import { useState, useEffect, useCallback } from "react"

export type ToastProps = {
  id?: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
  duration?: number
}

export type Toast = ToastProps & {
  id: string
  visible: boolean
}

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000

type ToasterToast = Toast & {
  onOpenChange?: (open: boolean) => void
}

const toasts: ToasterToast[] = []

// Create a unique ID for each toast
const generateId = () => {
  return Math.random().toString(36).substring(2, 9)
}

export function useToast() {
  const [mounted, setMounted] = useState(false)
  const [toastState, setToastState] = useState<ToasterToast[]>([])

  useEffect(() => {
    setMounted(true)
    return () => {
      setMounted(false)
    }
  }, [])

  const toast = useCallback(
    ({ ...props }: ToastProps) => {
      const id = props.id || generateId()
      const newToast = {
        ...props,
        id,
        visible: true,
        duration: props.duration || 5000,
      }

      setToastState((prevToasts) => {
        const updatedToasts = [...prevToasts, newToast].slice(-TOAST_LIMIT)
        return updatedToasts
      })

      // Auto-dismiss toast after duration
      setTimeout(() => {
        setToastState((prevToasts) =>
          prevToasts.map((toast) =>
            toast.id === id ? { ...toast, visible: false } : toast
          )
        )
        
        // Remove from DOM after animation
        setTimeout(() => {
          setToastState((prevToasts) => 
            prevToasts.filter((toast) => toast.id !== id)
          )
        }, TOAST_REMOVE_DELAY)
      }, newToast.duration)

      return id
    },
    [mounted]
  )

  // Render the toasts
  useEffect(() => {
    if (mounted) {
      toastState.forEach((toast) => {
        if (toast.visible) {
          // Create toast element
          const toastElement = document.createElement('div')
          toastElement.id = `toast-${toast.id}`
          toastElement.className = `fixed top-4 right-4 z-50 max-w-md rounded-md bg-white p-4 shadow-lg transition-all ${
            toast.variant === 'destructive' ? 'border-red-500 text-red-500' : 'border-gray-200'
          }`
          
          // Create title
          if (toast.title) {
            const titleElement = document.createElement('div')
            titleElement.className = 'font-medium'
            titleElement.textContent = toast.title
            toastElement.appendChild(titleElement)
          }
          
          // Create description
          if (toast.description) {
            const descElement = document.createElement('div')
            descElement.className = 'text-sm text-gray-500'
            descElement.textContent = toast.description
            toastElement.appendChild(descElement)
          }
          
          document.body.appendChild(toastElement)
          
          // Remove after duration
          setTimeout(() => {
            toastElement.classList.add('opacity-0')
            setTimeout(() => {
              if (document.body.contains(toastElement)) {
                document.body.removeChild(toastElement)
              }
            }, TOAST_REMOVE_DELAY)
          }, toast.duration)
        }
      })
    }
  }, [toastState, mounted])

  return { toast }
}

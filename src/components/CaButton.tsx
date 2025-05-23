import { useState } from "react"
import { motion } from "framer-motion"
import { clsx as $ } from "clsx"

interface CaButtonProps {
  caCode: string
}

export function CaButton({ caCode }: CaButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(caCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      className="max-w-3xl mx-auto mb-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        onClick={handleCopy}
        className={$([
          "relative w-full py-2.5 px-4 rounded-2xl",
          "bg-primary/5 shadow shadow-primary/20 hover:shadow-primary/50",
          "flex items-center justify-center gap-2 transition-all",
          "text-sm font-medium color-primary",
        ])}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <span className="font-mono font-bold">{caCode}</span>
        <span className="i-ph:copy-duotone text-lg"></span>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg z-10"
          >
            Copied to clipboard!
          </motion.div>
        )}
      </motion.button>
    </motion.div>
  )
}

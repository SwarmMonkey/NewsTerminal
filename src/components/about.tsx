import { motion } from "framer-motion"

export function About() {
  return (
    <motion.div
      className="max-w-3xl mx-auto mb-8 p-6 bg-primary/5 rounded-2xl shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold mb-3 color-primary">About News Terminal</h2>
      <p className="mb-3 text-sm op-80">
        NewsTerminal is a global news terminal built specifically for Americans to understand what is
        happening in China. Our mission is to bridge cultural and informational gaps by providing
        real-time access to Chinese news sources in a format that's accessible to Western audiences.
      </p>
      <p className="text-sm op-80">
        Stay informed about Chinese business, technology, culture, and politics through our
        carefully curated news feeds. NewsTerminal offers a unique window into one of the world's most
        dynamic and influential nations.
      </p>
      <p className="text-sm op-80 pt-2 border-t border-primary/10">
        <span className="flex items-center gap-1">
          <span className="i-ph:translate-duotone text-lg"></span>
          <span>For content in Chinese, we recommend using your browser's built-in translate features for the best experience.</span>
        </span>
      </p>
    </motion.div>
  )
}

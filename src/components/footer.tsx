export function Footer() {
  return (
    <footer className="p-4 md:p-8 lg:p-10">
      <div className="mx-auto max-w-screen-xl text-center">
        <a href="#" className="flex justify-center items-center text-2xl font-semibold text-gray-900 dark:text-white"> © News Terminal</a>
        <p className="my-6 text-gray-500 dark:text-gray-400">Your source for all the latest news and updates from overseas.</p>
        <ul className="flex flex-wrap justify-center items-center mb-6 text-gray-900 dark:text-white">
          <li>
            <a href="https://x.com/NewsTerminal_ai" target="_blank" rel="noopener noreferrer" className="hover:underline">Twitter</a>
          </li>
        </ul>
      </div>
    </footer>
  )
}

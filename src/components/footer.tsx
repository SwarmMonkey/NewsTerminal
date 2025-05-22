export function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="p-4 md:p-8 lg:p-10">
      <div className="mx-auto max-w-screen-xl text-center">
        <a href="#" className="flex justify-center items-center text-2xl font-semibold text-gray-900 dark:text-white">
          News Terminal
        </a>
        <p className="my-6 text-gray-500 dark:text-gray-400">Your source for all the latest news and updates.</p>
        <ul className="flex flex-wrap justify-center items-center mb-6 text-gray-900 dark:text-white">
          <li>
            <a href="#" className="mr-4 hover:underline md:mr-6">About</a>
          </li>
          <li>
            <a href="/premium-coming-soon" className="mr-4 hover:underline md:mr-6" title="Alert system coming soon">Premium</a>
          </li>
          <li>
            <a href="#" className="mr-4 hover:underline md:mr-6">Blog</a>
          </li>
          <li>
            <a href="#" className="mr-4 hover:underline md:mr-6">Contact</a>
          </li>
        </ul>
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          ©
          {currentYear}
          <a href="#" className="hover:underline">
            News Terminal
          </a>
          .
        </span>
      </div>
    </footer>
  )
}

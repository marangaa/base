import Image from 'next/image'
import { Suspense } from 'react'
import SearchResults from '@/components/SearchResults'
//import { Search } from 'lucide-react';

// Page no longer needs to handle searchParams since search is disabled
export default async function Home() {
  // Removed searchParams handling since search functionality is disabled  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-white">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 sm:pb-24 pt-12 sm:pt-20 lg:pt-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative h-16 w-16 sm:h-24 sm:w-24 rounded-full bg-blue-100 flex items-center justify-center">
                <Image 
                  src="/file.svg" 
                  alt="Document Icon" 
                  width={48} 
                  height={48}
                  className="h-8 w-8 sm:h-12 sm:w-12" 
                />
              </div>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
              Understanding Kenyan Bills & Proposals
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-600 max-w-xl mx-auto">
              Get clear explanations of new bills and how they affect you - no legal jargon, just straight talk.
            </p>

            {/* Search functionality temporarily disabled
            <form action="" method="get" className="mt-8 sm:mt-10">
              <div className="flex items-center max-w-xl mx-auto shadow-lg rounded-full overflow-hidden border-2 border-gray-100">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Search className="h-4 w-4 text-blue-500" />
                  </div>
                  <input
                    type="text"
                    name="query"
                    placeholder="Search for a bill or policy..."
                    defaultValue={query}
                    className="block w-full pl-10 pr-4 py-3 sm:py-4 border-0 focus:ring-0 focus:outline-none text-sm sm:text-base placeholder-gray-400"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 p-3 sm:p-4 transition-colors duration-200 flex-shrink-0"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </button>
              </div>
              
              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:hidden">
                <button
                  type="submit"
                  name="query" 
                  value="Budget Policy"
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors"
                >
                  Budget Policy
                </button>
                <button
                  type="submit"
                  name="query" 
                  value="AI Strategy"
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors"
                >
                  AI Strategy
                </button>
                <button
                  type="submit"
                  name="query" 
                  value="Virtual Assets"
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors"
                >
                  Virtual Assets
                </button>
              </div>
            </form>
            */}

            {/* Search functionality temporarily disabled
            <form action="" method="get" className="mt-8 sm:mt-10">
              <div className="flex items-center max-w-xl mx-auto shadow-lg rounded-full overflow-hidden border-2 border-gray-100">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Search className="h-4 w-4 text-blue-500" />
                  </div>
                  <input
                    type="text"
                    name="query"
                    placeholder="Search for a bill or policy..."
                    defaultValue={query}
                    className="block w-full pl-10 pr-4 py-3 sm:py-4 border-0 focus:ring-0 focus:outline-none text-sm sm:text-base placeholder-gray-400"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 p-3 sm:p-4 transition-colors duration-200 flex-shrink-0"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </button>
              </div>
              
              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:hidden">
                <button
                  type="submit"
                  name="query" 
                  value="Budget Policy"
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors"
                >
                  Budget Policy
                </button>
                <button
                  type="submit"
                  name="query" 
                  value="AI Strategy"
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors"
                >
                  AI Strategy
                </button>
                <button
                  type="submit"
                  name="query" 
                  value="Virtual Assets"
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors"
                >
                  Virtual Assets
                </button>
              </div>
            </form>
            */}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-gray-50 flex-grow">
        <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
          <SearchResults query={''} />
        </Suspense>
      </div>

      {/* Footer Section */}
      <footer className="bg-white border-t border-gray-200 py-6 sm:py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2025 Skika. All rights reserved.
            </p>
            <div className="mt-3 sm:mt-0 flex space-x-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
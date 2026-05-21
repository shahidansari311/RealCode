import React from 'react'
import { Editor } from "@monaco-editor/react"

const App = () => {
  return (
    <main className='h-screen w-full bg-gray-950 flex gap-4'>
      
      {/* User Listings  */}
      <aside className='h-full w-1/4 bg-amber-100 p-4 rounded-lg'>
      
      </aside>

      {/* Code editor */}
      <section className='w-3/4 bg-neutral-800 rounded-lg p-4'>
      <h2 className='text-2xl font-bold text-white m-0.5'>Code Editor</h2>
        <Editor
        height="96%"
        defaultLanguage='javascript'
        defaultValue='// Start coding here....'
        theme='vs-dark'
        />
      </section>
    </main>
  )
}

export default App
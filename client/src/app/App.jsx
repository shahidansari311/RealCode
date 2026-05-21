import React from 'react'
import { Editor } from "@monaco-editor/react"
import {MonacoBinding} from 'y-monaco'
import { useRef,useMemo } from 'react'
import * as Y from 'yjs'
import {SocketIOProvider} from 'y-socket.io'

const App = () => {

  const editorRef=useRef(null);

  // Ydoc ek file banati hai jisme sara code ek doc ke format me hota hai multiple file storage using key value pair 
  const ydoc=useMemo(()=>new Y.Doc(),[]);
  const yText=useMemo(()=>ydoc.getText("monaco"),[ydoc]);


  const handleMount=(editor)=>{
    editorRef.current=editor; 
    // To connect and match text on backend 
    const provider = new SocketIOProvider("http://localhost:3000/","monaco",ydoc,{
      autoConnect:true
    });
    const monacobinding= new MonacoBinding(
      yText,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness
    )
  }

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
        onMount={handleMount}
        />

      </section>
    </main>
  )
}

export default App
import React from 'react'
import { Editor } from "@monaco-editor/react"
import {MonacoBinding} from 'y-monaco'
import { useRef,useMemo,useState,useEffect } from 'react'
import * as Y from 'yjs'
import {SocketIOProvider} from 'y-socket.io'

const App = () => {

  const [username,SetUsername]=useState(()=>{
    return new URLSearchParams(window.location.search).get('username') || ""
  }); // persist data while reload also
  const editorRef=useRef(null);

  const [users,setUsers]=useState([]);

  // Ydoc ek file banati hai jisme sara code ek doc ke format me hota hai multiple file storage using key value pair 
  // match the data present on server and create delta qand then send delta to server 
  const ydoc=useMemo(()=>new Y.Doc(),[]);
  const yText=useMemo(()=>ydoc.getText("monaco"),[ydoc]);

  const handleMount=(editor)=>{
    editorRef.current=editor; 
    // Editor and yjs connection 
      const monacobinding= new MonacoBinding(
        yText,
        editorRef.current.getModel(),
        new Set([editorRef.current]),
        // provider.awareness to check which user selected which part
      )
  }

  const handleJoin=(e)=>{
    e.preventDefault(); //To prevent from page reload
    SetUsername(e.target.username.value)
    window.history.pushState({},"","?username="+e.target.username.value); //get username detail in url
  }

  useEffect(() => {
    if(username){

      // To connect and match text on backend 
      const provider = new SocketIOProvider("/","monaco",ydoc,{
        autoConnect:true
      });

      //Awareness handle how many users are connected and wokring 
      provider.awareness.setLocalStateField("user",{username})
      
      const states=Array.from(provider.awareness.getStates().values());
      setUsers(states.filter(state=>state && state.user && state.user.username).map(state=>state.user))

      provider.awareness.on("change",()=>{
        const states=Array.from(provider.awareness.getStates().values())
        setUsers(states.filter(state=> state && state.user && state.user.username).map(state=>state.user))
      })

      function handleBeforeUnload(){
        provider.awareness.setLocalStateField("user",null);
      }

      window.addEventListener("beforeunload",handleBeforeUnload);

      return ()=>{
        provider.disconnect();
        window.removeEventListener('beforeunload',handleBeforeUnload)
      }
    }
  }, [username])
  

  // Input field for Users 
  if(!username){
    return (
      <main className='h-screen w-full bg-gray-950 flex gap-4 items-center justify-center'>
        <form 
        onSubmit={handleJoin}
        className="flex flex-col gap-4">
          <input 
          type="text"
          placeholder='Enter your Username'
          className='p-2 rounded-lg bg-gray-800 text-white'
          name='username'
          />
          <button
            className='p-2 rounded-lg bg-amber-50 text-gray-950 font-bold'
          >
            Join
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className='h-screen w-full bg-gray-950 flex gap-4'>
      
      {/* User Listings  */}
      <aside className='h-full w-1/4 bg-amber-100 p-4 rounded-lg'>
       <h2 className='text-2xl font-bold p-4 border-b border-gray-300'>Users</h2>
       <ul className='p-4'>
        {
          users.map((user,index)=>(
            <li key={index} className='p-2 bg-gray-800 text-white rounded mb-2'>
              {user.username}
            </li>
          ))
        }
       </ul>
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
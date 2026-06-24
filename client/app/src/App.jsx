import { useState, useEffect } from 'react'
import bgHero from './assets/hero-bg.jpg'

import './App.css'

function App() {
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [secretSantas, setSecretSantas] = useState([])

  useEffect(() => {
    fetchSecretSantas()
  }, [])

  const fetchSecretSantas = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/list/')
      const data = await response.json()
      console.log(data)
      setSecretSantas(data.data)

    } catch (error) {
      console.error('Error fetching secret santas:', error)
    }
  };

  const addSecretSanta = async () => {
    const newSanta = {
      fullname: fullname,
      email: email
    }
    try {
      const response = await fetch('http://127.0.0.1:8000/api/list/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSanta)
      })

      const data = await response.json()
      console.log(data)
      setSecretSantas([...secretSantas, data.data])
      setFullname('')
      setEmail('')

    } catch (error) {
      console.error('Error adding secret santa:', error)

    }
  }


  return (
    <>
      <section>
        <h1>
          Making a List
        </h1>

        <input
          type="text"
          placeholder="Enter full name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={addSecretSanta}>Add</button>
      </section><section>
        <h1>Checking it Twice</h1>
        <ul>
          {secretSantas.map((santa) => (
            <li key={santa.id}>
              <strong>{santa.fullname}</strong> - {santa.email}
              <button>Edit</button>
              <button>Delete</button>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h1>Find out Who is Naughty or Nice</h1>
        <button>Draw Names</button>
      </section>
    </>

  )
}

export default App

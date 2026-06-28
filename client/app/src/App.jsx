import { useState, useEffect } from 'react'
import bgHero from './assets/hero-bg.jpg'

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

function App() {
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [secretSantas, setSecretSantas] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editSanta, setEditSanta] = useState({ fullname: '', email: '' })
  const [drawResult, setDrawResult] = useState([])

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

  const editSecretSanta = (santa) => {
    setEditingId(santa.id)
    setEditSanta({
      fullname: santa.fullname,
      email: santa.email
    })
  }


  const updateSecretSanta = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/list/edit/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editSanta)
      })

      const data = await response.json()

      setSecretSantas(secretSantas.map((santa) => (santa.id === id ? data.data : santa)))
      setEditingId(null)
      setEditSanta({ fullname: "", email: "" })

    } catch (error) {
      console.error('Error editing secret santa:', error)

    }
  }

  const deleteSecretSanta = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/list/delete/${id}/`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSecretSantas(secretSantas.filter((santa) => santa.id !== id))
      } else {
        console.error('Error deleting secret santa:', response.statusText)
      }
    } catch (error) {
      console.error('Error deleting secret santa:', error)
    }
  }

  const drawNames = async () => {
    try {
      const drawResponse = await fetch('http://127.0.0.1:8000/api/draw/', {
        method: 'POST',
      })

      if (!drawResponse.ok) {
      throw new Error("Draw failed");
      }

      const data = await drawResponse.json()
      console.log(data.data)
      setDrawResult(data.data)
      const emailResponse = await fetch('http://127.0.0.1:8000/api/send-email/', {
        method: 'POST',
      })
      if (!emailResponse.ok) {
      throw new Error("Email sending failed");
      }
      
      const emailData = await emailResponse.json();
   
      
    } catch (error) {
      console.error('Error drawing names:', error)
    }
  }


  return (
    <>
    <div className="app">
      <section>
        <h1 className="mb-4">
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
        <button className="btn btn-success" onClick={addSecretSanta}>Add</button>
      </section>
      <section>
        <h1 className="mb-4">Checking it Twice</h1>
        <ul className="list-group">
          {secretSantas.map((santa) => (
            <li key={santa.id} className="list-group-item d-flex justify-content-between align-items-center">
              {editingId === santa.id ? (
                <>
                  <input
                    name="fullname"
                    value={editSanta.fullname}
                    onChange={(e) =>
                      setEditSanta({
                        ...editSanta,
                        [e.target.name]: e.target.value
                      })
                    }
                  />
                  <input
                    name="email"
                    value={editSanta.email}
                    onChange={(e) =>
                      setEditSanta({
                        ...editSanta,
                        [e.target.name]: e.target.value
                      })
                    }
                  />
                  <button className="btn btn-success"  onClick={() => updateSecretSanta(santa.id)}>Save</button>
                  <button className="btn btn-danger" onClick={() => setEditingId(null)}>Cancel</button>
                </>

              ) : (
                <>
                  <strong>{santa.fullname}</strong> - {santa.email}
                  <div className="d-flex gap-2">
                  <button className="btn btn-success" onClick={() => editSecretSanta(santa)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => deleteSecretSanta(santa.id)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
     
      </section>
      <section>
        <h1 className="mb-4">Find out Who is Naughty or Nice</h1>
        <div className="d-flex justify-content-center">
        <button className="btn btn-danger btn-lg" onClick={drawNames}>Draw Names</button>
        </div>
      </section>
      </div>
    </>

  )
}


export default App

import { useEffect, useState } from 'react'
import noteService from '../services/notes'
import loginService from '../services/login'
import Togglable from './Togglable'
import LoginForm from './LoginForm'
import Notification from './Notification'
import Note from './Note'

const NoteList = ({ notes }) => {
    const [showAll, setShowAll] = useState(true)
    const [errorMessage, setErrorMessage] = useState(null)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            noteService.setToken(user.token)
        }
    }, [])

    const toggleImportanceOf = id => {
        const note = notes.find(note => note.id === id)
        const changedNote = { ...note, important: !note.important }

        noteService
            .update(id, changedNote)
            .then(returnedNote => {
                // setNotes(notes.map(note => (note.id !== id ? note : returnedNote)))
            })
            .catch((error) => {
                setErrorMessage(
                    `Note ${note.content} was already removed from server`
                )
                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000)
                // setNotes(notes.filter(note => note.id !== id))
            })
    }

    const notesToShow = showAll ? notes : notes.filter(note => note.important)

    const login = async (username, password) => {
        try {
            const user = await loginService.login({ username, password })
            window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
            noteService.setToken(user.token)
            setUser(user)
        } catch (error) {
            setErrorMessage(error.response.data.error)
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    const logout = () => {
        window.localStorage.removeItem('loggedNoteappUser')
        setUser(null)
    }

    const loginForm = () => {
        return (
            <Togglable buttonLabel='login'>
                <LoginForm loginUser={login} />
            </Togglable>
        )
    }

    return (
        <div>
            <h1>Notes</h1>
            <Notification message={errorMessage} />

            {!user && loginForm()}
            {user && (
                <div>
                    <p>{user.name} logged in</p>
                    <button onClick={logout}>logout</button>
                </div>
            )}

            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? 'important' : 'all'}
                </button>
            </div>
            <ul>
                {notesToShow.map(note => (
                    <Note
                        key={note.id}
                        note={note}
                        toggleImportance={() => toggleImportanceOf(note.id)}
                    />
                ))}
            </ul>
        </div>
    )
}

export default NoteList

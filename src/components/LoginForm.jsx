import { useState } from 'react'

const LoginForm = ({ loginUser }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const login = async (event) => {
        event.preventDefault()
        await loginUser(username, password)
        setUsername('')
        setPassword('')
    }

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={login}>
                <div>
                    <label>
                        username
                        <input
                            value={username}
                            onChange={({ target }) => setUsername(target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        password
                        <input
                            type="password"
                            value={password}
                            onChange={({ target }) => setPassword(target.value)}
                        />
                    </label>
                </div>
                <button type="submit">login</button>
            </form>
        </div>

    )
}

export default LoginForm

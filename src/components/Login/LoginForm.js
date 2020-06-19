import ApiContext from '../../ApiContext'
import AuthApiService from '../../services/auth-api-service'
import config from '../../config'
import React, { Component } from 'react'
import TokenService from '../../services/token-service'

export default class LoginForm extends Component {
    static contextType = ApiContext

    static defaultProps = {
        onLoginSuccess: () => {},
        setUserInfo: () => {},
    }

    state = {
        error: null,
    }

    handleSubmitJwtAuth = ev => {
        ev.preventDefault()
        this.setState({ error: null })
        const { email, password } = ev.target
        const userEmail = email.value
        AuthApiService.postLogin({
            email: email.value,
            password: password.value,
        })
        .then(res => {
            fetch(`${config.API_ENDPOINT}/users`, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error(res.status)
                    }
                    return res.json()
                })
                .then(data => {
                    let currentUser
                    data.filter(user => {
                        for (let key in user) {
                            if (user.email === userEmail) {
                                currentUser = user
                            }
                        }
                    })
                    const userInfo = {
                        full_name: currentUser.full_name,
                        email: currentUser.email, 
                        id: currentUser.id
                    }
                    this.context.setUserInfo(userInfo)
                })
                .catch(error => {
                    console.error(error)
                })
            email.value = ''
            password.value = ''
            TokenService.saveAuthToken(res.authToken)
            this.props.onLoginSuccess()
        })
        .catch(res => {
            this.setState({ error: res.error })
        })
    }

    render() {
        const { error } = this.state
        return (
            <form
                className='LoginForm'
                onSubmit={this.handleSubmitJwtAuth}
            >
                <div role='alert'>
                    {error && <p className='red'>{error}</p>}
                </div>
                <div className='emailInput'>
                    <label htmlFor="email">Email</label>
                    <input type="email" name='email' id='email' />
                </div>
                <div className='passwordInput'>
                    <label htmlFor="password">Password</label>
                    <input type="password" name='password' id='password' />
                </div>
                <div className='buttons'>
                    <button type='submit'>
                        Login
                    </button>
                </div>
            </form>
        )
    }
}
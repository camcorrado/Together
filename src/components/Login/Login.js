import React from 'react'
import Title from '../Title/Title'

class Login extends React.Component {

    state = {
        email: '',
        password: '',
        touchChanges: {
            emailChange: {
                touched: false
            },
            passwordChange: {
                touched: false
            }
        }
    }

    handleClickSubmit = (e) => {
        e.preventDefault()
        if (!this.validateEmail(this.state.email) || !this.validatePassword(this.state.password)) {
            document.getElementById('submitMessage').innerHTML = `<p>Email or password is invalid</p>`
        } else {
            this.props.history.push('/Grid')
        }
    }

    onChangeEmail = async (value) => {
        this.setState({ 
            touchChanges: { 
                emailChange: {
                    touched: true
                } 
            } 
        })
        await this.setState({email: value})
    }

    onChangePassword = async (value) => {
        this.setState({ 
            touchChanges: { 
                passwordChange: {
                    touched: true
                } 
            } 
        })
        await this.setState({password: value})
    }

    validateEmail(value) {
        const emailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
        if (value.length === 0) {
            return false
        } else if (!value.match(emailFormat)) {
            return false
        } else {
            return true
        }
    }

    validatePassword(value) {
        if (value.length === 0) {
            return false
        } else if (value.length < 8) {
            return false
        } else if (!/[a-z]/.test(value)) {
            return false
        } else if (!/[A-Z]/.test(value)) {
            return false
        } else if (!/\d/.test(value)) {
            return false
        } else {
            return true
        }
    }

    render() {
        return (
            <section className='Login'>
                <Title />
                <section className='formContainer'>
                    <form className='loginForm'>
                        <div className='emailInput'>
                            <label htmlFor="email">Email</label>
                            <input type="email" name='email' id='email' 
                                onChange={e => this.onChangeEmail(e.target.value)} 
                            />
                        </div>
                        <div className='passwordInput'>
                            <label htmlFor="password">Password</label>
                            <input type="password" name='password' id='password' 
                                onChange={e => this.onChangePassword(e.target.value)} 
                            />
                        </div>
                        <div id='submitMessage'></div>
                        <div className='buttons'>
                            <button 
                                type='submit'
                                onClick={this.handleClickSubmit}>Login
                            </button>
                        </div>
                    </form>
                </section>
            </section>
        )
    }
}

export default Login

      

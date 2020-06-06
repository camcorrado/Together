import React from 'react'
import Title from '../Title/Title'
import ValidationError from '../ValidationError'

class SignUp extends React.Component {

    state = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        touchChanges: {
            firstNameChange: {
                touched: false
            },
            lastNameChange: {
                touched: false
            },
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
        if (this.validateFirstName(this.state.firstName) !== true || this.validateLastName(this.state.lastName) !== true || this.validateEmail(this.state.email) !== true || this.validatePassword(this.state.password) !== true) {
            document.getElementById('submitMessage').innerHTML = `<p>Please enter valid information</p>`
        } else {
            this.props.history.push('/EditProfile')
        }
    }

    onChangeFirstName = async (value) => {
        await this.setState(prevState => ({
            touchChanges: {
                ...prevState.touchChanges,
                firstNameChange: {
                    touched: true
                }
            }
        }))
        await this.setState({firstName: value})
    }

    onChangeLastName = async (value) => {
        await this.setState(prevState => ({
            touchChanges: {
                ...prevState.touchChanges,
                lastNameChange: {
                    touched: true
                }
            }
        }))
        await this.setState({lastName: value})
    }

    onChangeEmail = async (value) => {
        await this.setState(prevState => ({
            touchChanges: {
                ...prevState.touchChanges,
                emailChange: {
                    touched: true
                }
            }
        }))
        await this.setState({email: value})
    }

    onChangePassword = async (value) => {
        await this.setState(prevState => ({
            touchChanges: {
                ...prevState.touchChanges,
                passwordChange: {
                    touched: true
                }
            }
        }))
        await this.setState({password: value})
    }

    validateFirstName(value) {
        if (value.length === 0) {
            return 'First name is required'
        } else if (value.length < 2) {
            return 'First name must be at least two characters long'
        } else {
            return true
        }
    }

    validateLastName(value) {
        if (value.length === 0) {
            return 'Last name is required'
        } else if (value.length < 2) {
            return 'Last name must be at least two characters long'
        } else {
            return true
        }
    }

    validateEmail(value) {
        const emailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
        if (value.length === 0) {
            return 'Email is required'
        } else if (!value.match(emailFormat)) {
            return 'Email invalid'
        } else {
            return true
        }
    }

    validatePassword(value) {
        if (value.length === 0) {
            return 'Password is required'
        } else if (value.length < 8) {
            return 'Password must be at least eight characters long'
        } else if (!/[a-z]/.test(value)) {
            return 'Password must contain at least one lowercase letter'
        } else if (!/[A-Z]/.test(value)) {
            return 'Password must contain at least one uppercase letter'
        } else if (!/\d/.test(value)) {
            return 'Password must contain at least one number'
        } else {
            return true
        }
    }

    render() {
        return (
            <section className='signUp'>
                <Title />
                <section className='formContainer'>
                    <form className='signUpForm'>
                        <div className='firstNameInput'>
                            <label htmlFor="firstName">First name</label>
                            <input type="text" name='firstName' id='firstName' 
                                onChange={e => this.onChangeFirstName(e.target.value)} 
                            />
                            {this.state.touchChanges.firstNameChange.touched && <ValidationError message={this.validateFirstName(this.state.firstName)} />}
                        </div>
                        <div className='lastNameInput'>
                            <label htmlFor="lastName">Last name</label>
                            <input type="text" name='lastName' id='lastName' 
                                onChange={e => this.onChangeLastName(e.target.value)} 
                            />
                            {this.state.touchChanges.lastNameChange.touched && <ValidationError message={this.validateLastName(this.state.lastName)} />}
                        </div>
                        <div className='emailInput'>
                            <label htmlFor="email">Email</label>
                            <input type="email" name='email' id='email' 
                                onChange={e => this.onChangeEmail(e.target.value)} 
                            />
                            {this.state.touchChanges.emailChange.touched && <ValidationError message={this.validateEmail(this.state.email)} />}
                        </div>
                        <div className='passwordInput'>
                            <label htmlFor="password">Password</label>
                            <input type="password" name='password' id='password'
                                onChange={e => this.onChangePassword(e.target.value)} 
                            />
                            {this.state.touchChanges.passwordChange.touched && <ValidationError message={this.validatePassword(this.state.password)} />}
                        </div>
                        <div id='submitMessage'></div>
                        <div className='buttons'>
                            <button 
                                type='submit'
                                onClick={this.handleClickSubmit}>Sign Up
                            </button>
                        </div>
                    </form>
                </section>
            </section>
        )
    }
}

export default SignUp

      

import React from 'react'
import Title from '../Title/Title'

class SignUp extends React.Component {

    handleClickSubmit = (e) => {
        e.preventDefault()
        this.props.history.push('/EditProfile')
    }

    render() {
        return (
            <section className='signUp'>
                <Title />
                <section className='formContainer'>
                    <form className='signUpForm'>
                        <div className='firstNameInput'>
                            <label for="first-name">First name</label>
                            <input type="text" name='first-name' id='first-name' />
                        </div>
                        <div className='lastNameInput'>
                            <label for="last-name">Last name</label>
                            <input type="text" name='last-name' id='last-name' />
                        </div>
                        <div className='emailInput'>
                            <label for="email">Email</label>
                            <input type="email" name='email' id='email' />
                        </div>
                        <div className='passwordInput'>
                            <label for="password">Password</label>
                            <input type="password" name='password' id='password' />
                        </div>
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

      

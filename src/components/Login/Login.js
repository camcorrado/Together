import React from 'react'
import Title from '../Title/Title'

class Login extends React.Component {

    handleClickSubmit = (e) => {
        e.preventDefault()
        this.props.history.push('/Grid')
    }

    render() {
        return (
            <section className='Login'>
                <Title />
                <section className='formContainer'>
                    <form className='loginForm'>
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

      

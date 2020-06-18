import LoginForm from './LoginForm'
import React, { Component } from 'react'

export default class LoginPage extends Component {
    static defaultProps = {
        history: {
            push: () => {},
        },
    }
  
    handleLoginSuccess = () => {
        this.props.history.push('/grid')
    }
  
    render() {
        return (
            <section className='LoginPage'>
                <h2>Login</h2>
                <LoginForm
                    onLoginSuccess={this.handleLoginSuccess}
                />
            </section>
        ) 
    }
}
      

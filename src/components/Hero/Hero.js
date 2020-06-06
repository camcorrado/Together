import React from 'react'
import Title from '../Title/Title'

class Hero extends React.Component {
    render() {
        return (
            <section className='hero'>
                <Title />
                <section className='appDescription'>
                    <h3>LGBTQ+ Locals</h3>
                    <p>Find nearby LGBTQ+ people to befriend based on similar interests!</p>
                </section>
                <section className='buttons'>
                    <button onClick={() => this.props.history.push('/SignUp')}>Sign Up</button>
                    <button onClick={() => this.props.history.push('/Login')}>Login</button>
                </section>
            </section>
        )
    }
}

export default Hero


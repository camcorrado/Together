import React from 'react'

class Hero extends React.Component {
    render() {
        return (
            <section className='hero'>
                <section className='appDescription'>
                    <h3>LGBTQ+ Locals</h3>
                    <p>Find nearby LGBTQ+ people to befriend based on similar interests!</p>
                </section>
                <section className='buttons'>
                    <button onClick={() => this.props.history.push('/signup')}>Sign Up</button>
                    <button onClick={() => this.props.history.push('/login')}>Login</button>
                </section>
            </section>
        )
    }
}

export default Hero


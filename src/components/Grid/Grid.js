import React from 'react'

class Grid extends React.Component {

    handleClickEditProfile = (e) => {
        e.preventDefault()
        this.props.history.push('/EditProfile')
    }

    handleClickLogOut = (e) => {
        e.preventDefault()
        this.props.history.push('/')
    }

    handleClickProfile = (e) => {
        e.preventDefault()
        this.props.history.push('/UserProfile')
    }

    render() {
        return (
            <section className='grid'>
                <section className='nav'>
                    <nav role="navigation">
                        <button onClick={this.handleClickEditProfile}>Edit Profile</button>
                        <button onClick={this.handleClickLogOut}>Log Out</button>
                    </nav>
                </section>
                <section className='profiles'>
                <p>Grid of profiles, displaying profile pics and emoji overlay to show interests</p>
                </section>
                <button onClick={this.handleClickProfile}>View Profile Test</button>
            </section>
        )
    }
}

export default Grid





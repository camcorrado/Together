import React from 'react'

class UserProfile extends React.Component {

    handleClickBack = (e) =>{
        e.preventDefault()
        this.props.history.push('/Grid')
    }

    handleClickEdit = (e) => {
        e.preventDefault()
        this.props.history.push('/EditProfile')
    }

    render() {
        return (
            <section className='userProfile'>
                <section className='username'>
                    <h1>USERNAME</h1>
                </section>
                <section className='profilePic'>
                    <p>PROFILE PIC</p>
                </section>
                <section className='interests'>
                    <ul>
                        <li> List of checked interests</li>
                    </ul>
                </section>
                <section className='bio'>
                    <p>BIO</p>
                </section>
                <section className='buttons'>
                        <button onClick={this.handleClickEdit}>Edit Profile</button>
                        <button onClick={() => this.props.history.push('/Grid')}>Back</button>
                        <button onClick={() => this.props.history.push('/Messenger')}>Message</button>
                </section>
            </section>
        )
    }
}

export default UserProfile
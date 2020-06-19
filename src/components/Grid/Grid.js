import config from '../../config'
import ProfileIcon from './ProfileIcon'
import React, { Component } from 'react'

export default class Grid extends Component {

    state = {
        profiles: []
    }

    componentDidMount() {
        fetch(`${config.API_ENDPOINT}/profiles`, {
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
            .then(data => this.setState({ profiles: data }))
            .catch(error => {
                console.error(error)
            })
    }

    handleClickEditProfile = (e) => {
        e.preventDefault()
        const profile_id = this.
        this.props.history.push(`/EditProfile/${profile_id}`)
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
                    <ul>
                        {this.state.profiles.map(profile =>
                            <li className={profile.id}>    
                                <ProfileIcon 
                                    id={profile.id}
                                    user_id={profile.user_id}
                                    profile_pic={profile.profile_pic}
                                    username={profile.username}
                                    interests={profile.interests}
                                />
                            </li>
                        )}
                    </ul>
                <p>Grid of profiles, displaying profile pics and emoji overlay to show interests</p>
                </section>
                <button onClick={this.handleClickProfile}>View Profile Test</button>
            </section>
        )
    }



}





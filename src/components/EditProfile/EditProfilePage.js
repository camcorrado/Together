import EditProfileForm from './EditProfileForm'
import React, { Component } from 'react'

export default class EditProfilepage extends Component {
    static defaultProps = {
        history: {
            push: () => {},
        },
    }

    handleEditSuccess = () => {
        this.props.history.push('/UserProfile')
    }

    render() {
        return (
            <section className='EditProfilePage'>
                <header>
                    <h1>Edit Your Profile</h1>
                </header>
                <EditProfileForm 
                    onEditSuccess={this.handleEditSuccess}
                />
            </section>
        )
    }
}
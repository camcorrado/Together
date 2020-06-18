import CreateProfileForm from './CreateProfileForm'
import React, { Component } from 'react'

export default class CreateProfilePage extends Component {
    static defaultProps = {
        history: {
            push: () => {},
        },
    }

    handleEditSuccess = () => {
        this.props.history.push('/grid')
    }

    render() {
        return (
            <section className='CreateProfilePage'>
                <header>
                    <h1>Create Your Profile</h1>
                </header>
                <CreateProfileForm 
                    onCreateSuccess={this.handleCreateSuccess}
                />
            </section>
        )
    }
}
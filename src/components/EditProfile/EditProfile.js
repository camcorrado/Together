import React from 'react'

class EditProfile extends React.Component {

    handleClickDelete = (e) => {
        e.preventDefault()
    }

    handleClickSubmit = (e) => {
        e.preventDefault()
        this.props.history.push('/UserProfile')
    }

    render() {
        return (
            <section className='editProfile'>
                <header>
                    <h1>Create/Edit Your Profile</h1>
                </header>
                <section className='formContainer'>
                    <form className='editProfileForm'>
                        <div className='usernameInput'>
                            <label for='username'>Username</label>
                            <input type='text' name='username' id='username' required />
                        </div>
                        <div className='bioInput'>
                            <label for='bio'>About</label>
                            <textarea name='bio' id='bio' rows='15'></textarea>
                        </div>
                        <div className='interestsInput'>
                            <label for='interests'>Interests</label>
                            <div className='interestCheckboxes'>
                                <input type='checkbox' name='interest' value='0' class='interest-checkbox' />
                                <label for='interest'>Activism</label>
                                <input type='checkbox' name='interest' value='1' class='interest-checkbox' />
                                <label for='interest'>Drag / Performance Art</label>
                                <input type='checkbox' name='interest' value='2' class='interest-checkbox' />
                                <label for='interest'>Gaming</label>
                                <input type='checkbox' name='interest' value='3' class='interest-checkbox' />
                                <label for='interest'>Reading</label>
                                <input type='checkbox' name='interest' value='4' class='interest-checkbox' />
                                <label for='interest'>Nightlife</label>
                            </div>
                        </div>
                        <div className='buttons'>
                            <button 
                                type='submit'
                                onClick={this.handleClickSubmit}>Submit
                            </button>
                            <button onClick={() => this.props.history.push('/UserProfile')}>Cancel</button>
                            <button onClick={this.handleClickDelete}>Delete Profile</button>
                        </div>
                    </form>
                </section>
            </section>
        )
    }
}

export default EditProfile
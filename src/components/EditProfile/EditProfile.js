import React from 'react'
import ValidationError from '../ValidationError'

class EditProfile extends React.Component {

    state = {
        username: '',
        usernameChange: {
            touched: false
        }
    }

    handleClickDelete = (e) => {
        e.preventDefault()
    }

    handleClickSubmit = (e) => {
        e.preventDefault()
        this.props.history.push('/UserProfile')
    }

    onChangeUsername = async (value) => {
        this.setState({ usernameChange: { touched: true } })
        await this.setState({username: value})
    }

    validateUsername(value) {
        if (value.length === 0) {
            return 'Username is required'
        } else {
            return true
        }
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
                            <label htmlFor='username'>Username</label>
                            <input type='text' name='username' id='username' required 
                                onChange={e => this.onChangeUsername(e.target.value)} 
                            />
                            {this.state.usernameChange.touched && <ValidationError message={this.validateUsername(this.state.username)} />}
                        </div>
                        <div className='bioInput'>
                            <label htmlFor='bio'>About</label>
                            <textarea name='bio' id='bio' rows='15'></textarea>
                        </div>
                        <div className='interestsInput'>
                            <label htmlFor='interests'>Interests</label>
                            <div className='interestCheckboxes'>
                                <input type='checkbox' name='interest' value='0' className='interest-checkbox' />
                                <label htmlFor='interest'>Activism</label>
                                <input type='checkbox' name='interest' value='1' className='interest-checkbox' />
                                <label htmlFor='interest'>Drag / Performance Art</label>
                                <input type='checkbox' name='interest' value='2' className='interest-checkbox' />
                                <label htmlFor='interest'>Gaming</label>
                                <input type='checkbox' name='interest' value='3' className='interest-checkbox' />
                                <label htmlFor='interest'>Reading</label>
                                <input type='checkbox' name='interest' value='4' className='interest-checkbox' />
                                <label htmlFor='interest'>Nightlife</label>
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
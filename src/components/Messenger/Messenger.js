import React from 'react'

class Messenger extends React.Component {

    handleClickSend = (e) => {
        e.preventDefault()
    }

    render() {
        return (
            <section className='messenger'>
                <section>
                <p>Previous message history</p>
                </section>
                <section>
                <form className='messageForm'>
                    <div className='message'>
                    <textarea name="bio" rows="15" required></textarea>
                    </div>
                    <button type="submit" onClick={this.handleClickSend}>Send</button>
                    <button onClick={() => this.props.history.push('/UserProfile')}>Back</button>
                </form>
                </section>
            </section>
        )
    }
}

export default Messenger

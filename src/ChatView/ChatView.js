import Chat from '../Chat/Chat';
import io from 'socket.io-client';
import React from 'react';
const host='6fa41f1a6482.ngrok.io';
//const host='localhost:3001';
const socket = io("wss://"+host, {
    reconnectionDelayMax: 10000,
    query: {
        auth: "123"
    },
    transport : ['websocket']
});
export default class ChatView extends React.Component {
    constructor(props) {
        super(props);
        this.meNick = null;
        this.onSendButton = this.onSendButton.bind(this);
        this.onCreateButton = this.onCreateButton.bind(this);
        this.onFindButton = this.onFindButton.bind(this);
        this.state = {
            chatView: false,
            chatID: null,
            messages: [],
        }
    }
    onCreateButton() {
        let meNick = document.getElementById('me').value;
        this.meNick = meNick;
        fetch('https://'+host+'/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sender: meNick,
            })
        }).then(res => {
            if ('status' in res) {
                if (res.status === 200) {
                    console.log('status ok');
                    this.connnectSockets();
                }
            }
        });
    }
    connnectSockets() {
        console.log('sockets on');
        socket.emit('pushNick', this.meNick);
    }
    onFindButton() {
        let friendNick = document.getElementById('friend').value;
        fetch('https://'+host+'/createChat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sender: this.meNick,
                recipient: friendNick
            })
        }).then(res => res.json()).then(
            res => {
                if ('id' in res) {
                    this.setState({
                        chatView: true,
                        chatID: res.id,
                    });
                    this.requestMessages(res.id);
                    if ('error' in res) {
                        alert(res.error);
                    }
                }
            }
        )
    }
    requestMessages(id) {
        fetch('https://'+host+'/requestMessages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chatID: id
            })
        }).then(res => res.json()).then(json => this.setState({ messages: json.messages }));
    }
    componentDidMount() {
        socket.on('new message', msg => { this.newMessage(msg) })
    }
    newMessage(msg) {
        console.log('new smg');
        console.log(msg);
        let messages = this.state.messages;
        messages.push(msg.msg);
        this.setState({
            messages: messages
        });
    }
    onSendButton(id) {
        socket.emit('chat message', {
            chatID: id,
            msg: {
                text: document.getElementById('text').value,
                sender: this.meNick
            }
        });
    }
    render() {
        return (
            <div>
                <input type='text' id='me' placeholder='your nick' />
                <button onClick={this.onCreateButton}>Create</button>
                <input type='text' id='friend' placeholder='your frined nick' />
                <button onClick={this.onFindButton}>Find friend</button>
                {(this.state.chatView ? (<Chat onSendButton={() => this.onSendButton(this.state.chatID)} messages={this.state.messages} myNick={this.meNick} />) : null)}
            </div>
        )
    }

}
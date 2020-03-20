import React, { Component } from 'react';
import './app.css';

export default class App extends Component {
  state = { users: null };

  componentDidMount() {
    fetch('/api/users')
      .then(res => res.json())
      .then(results => this.setState({ users: results.users }));
  }

  render() {
    const { users } = this.state;

    return (
      <div>
        {users ? users.map(user => (
          <div key={user}>
            <h2>{user.id}</h2>
            <h2>{user.name}</h2>
            <h3>{user.email}</h3>
          </div>
        ))
          : <h2>loading...</h2>}
      </div>
    );
  }
}

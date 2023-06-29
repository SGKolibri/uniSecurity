import React, { Component } from 'react'
import Navbar from '../Navbar/navbar.component';
import { Navigate } from 'react-router-dom';

export default class SignUp extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      surname: '',
      email: '',
      password: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { name, surname, email, password } = this.state;
    console.log(name, surname, email, password);
    fetch('http://localhost:3000/register', {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        name,
        surname,
        email,
        password
      }),
    })
      .then((res) => res.json())
      .then(() => {
        < Navigate to="/login" />
        alert("Usuário cadastrado com sucesso!");

      });
  }

  render() {
    return (
      <>
        <Navbar className="App" />
        <div className="auth-wrapper">
          <div className="auth-inner">
            <form onSubmit={this.handleSubmit}>
              <h3>Registrar</h3>

              <div className="mb-3">
                <label>Nome</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="nome"
                  required
                  onChange={e => this.setState({ name: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label>Sobrenome</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="sobrenome"
                  required
                  onChange={e => this.setState({ surname: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="digite seu email"
                  required
                  onChange={e => this.setState({ email: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label>Senha</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="digite sua senha"
                  required
                  onChange={e => this.setState({ password: e.target.value })}
                />
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Registrar
                </button>
              </div>
              <p className="forgot-password text-right">
                Já registrado <a href="/sign-in">login?</a>
              </p>
            </form>
          </div>
        </div>
      </>
    )
  }
}

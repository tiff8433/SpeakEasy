var React = require('react');
var helpers = require('../config/helper.js');

var Signin = React.createClass({

  componentDidMount: function() {
    window.analytics.page('Signin');
  },

  handleSubmit: function(e){ 
    e.preventDefault();
    var user = {
      username: this.refs.username.value,
      password: this.refs.password.value
    }
 
    helpers.login(user).then(function(response){
      if(response.status === 200){
        localStorage.token = user.username;
        this.props.history.transitionTo({
          pathname: '/dashboard',
          search: '?a=query',
        })
      } else {
        alert('incorrect credentials');
      }
    }.bind(this));

  },
  render: function() {
    return (
      <div>
        <div id="signin">
          <form className="col s12" onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="input-field col s12">
                <input placeholder="Username" ref='username' id="username" type="text" className="validate" />
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <input placeholder="Password" ref='password' id="password" type="password" className="validate" />
              </div>
            </div>
            <div className="row">
                <p>Not registered? <a href="#/signup">SignUp...</a></p>
            </div>
          <button className="btn waves-effect waves-light" type="submit" name="action">Submit
            <i className="material-icons right">send</i>
          </button>
         </form>
        </div>
      </div>
    )
  }
});

module.exports = Signin;
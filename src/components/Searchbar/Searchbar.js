import React, { Component } from 'react';
import PropTypes from 'prop-types';
import css from './searchBar.module.css';

class Searchbar extends Component {
  state = {
    query: '',
  };

  handleChange = event => {
    this.setState({ query: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.state.query.trim === '') {
      alert('Please enter somthing');
      return;
    }

    this.props.onSubmit(this.state.query);
    this.setState({ query: '' });
  };

  render() {
    return (
      <header className={css.header}>
        <form className={css.form} onSubmit={this.handleSubmit}>
          <button className={css.btn} type="submit">
            <span className={css.label}>Search</span>
          </button>

          <input
            className={css.input}
            type="text"
            id="searchInput"
            name="searchInput"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            value={this.state.query}
            onChange={this.handleChange}
          ></input>
        </form>
      </header>
    );
  }
}

Searchbar.propTypes = {
    onSubmit: PropTypes.func.isRequired
}

export default Searchbar;
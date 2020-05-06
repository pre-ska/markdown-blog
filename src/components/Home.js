import React, { Component } from "react";
import db from "../firebase";
import { Link } from "react-router-dom";
import uuid from "uuid/v4";

class Home extends Component {
  state = {
    posts: [],
    title: "",
  };

  componentDidMount() {
    // https://firebase.google.com/docs/reference/js/firebase.database.Reference.html#on
    // sluša promjene na lokaciji
    // ovo je primarni način čitanja podataka iz db
    db.ref("/posts").on("value", snapshot => {
      //dobijem snapshot kolekcije dokumanata
      let posts = [];
      snapshot.forEach(childSnapshot => {
        //izvučem cijeli obijekt sa .val() i još pridodam key
        //koji je u biti ID od snapshota (nije unutar njega)
        posts.push({ ...childSnapshot.val(), key: childSnapshot.key });
      });
      // popunjen array ubacim u state
      this.setState({ posts });
    });
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const id = uuid();
    // ako je title prazan, nemoj kreirati novi post
    if (this.state.title === "") return;
    // ako nije, kreiraj novi post sa praznim body-em
    db.ref(`posts/${id}`)
      .set({
        title: this.state.title,
        body: "",
      })
      .then(res => {
        //zatim preusmjeri url na taj post
        this.props.history.push(`/post/${id}`);
      })
      .catch(err => console.log(err));
  };

  render() {
    console.log(this.state.posts);
    return (
      <div>
        <h1 className="mt-4 mb-4 text-center">Create or edit a post</h1>
        <form onSubmit={this.onSubmit}>
          <div className="input-group mb-3">
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="Create a post..."
              value={this.state.title}
              onChange={this.onChange}
            />
            <div className="input-group-append">
              <button className="btn btn-success" type="submit">
                Create
              </button>
            </div>
          </div>
        </form>
        <div className="text-center">
          <h3>Available posts:</h3>
          {this.state.posts.map(post => (
            <div key={post.key} className="mt-4 mb-4">
              <Link to={`/post/${post.key}`} className="post-link">
                <h2>{post.title}</h2>
                <hr />
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Home;

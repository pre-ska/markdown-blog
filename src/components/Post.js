import React, { Component } from "react";
import { Link } from "react-router-dom";
import db from "../firebase";
import ReactMarkdown from "react-markdown";

class Post extends Component {
  constructor(props) {
    super(props);
    //tipkanje texta u textboxu je frekventna radnja
    //a kontrolirane komponente idu preko state-a
    //pa bi stalno morao updejtat state
    // umjesto toga koristim "ref" - referencu
    // jednu za title, i jednu za body
    this.titleRef = React.createRef();
    this.bodyRef = React.createRef();

    // pošto trebam i databse referencu na ID od posta,
    // mogu je napraviti i ovdje direktno
    // ovo je firebase (FB) referenca, za razliku od prethodnih koje su react DOM reference
    this.post_FB_ref = db.ref(`posts/${this.props.match.params.postId}`);

    this.state = {
      markdownBody: "",
    };
  }

  componentDidMount() {
    this.post_FB_ref.on("value", snapshot => {
      if (!snapshot.val()) return;
      this.titleRef.current &&
        (this.titleRef.current.value = snapshot.val().title);
      this.bodyRef.current &&
        (this.bodyRef.current.value = snapshot.val().body);
      this.setState({
        markdownBody: snapshot.val().body,
      });
    });
  }

  onChange = () => {
    this.post_FB_ref
      .set({
        title: this.titleRef.current.value,
        body: this.bodyRef.current.value,
      })
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };

  render() {
    return (
      <>
        <div className="row">
          <div className="col col-sm-12">
            <Link to="/">Home</Link>
          </div>
          <div className="col col-sm-12">
            <input
              // nemam onSubmit jer koristim reference
              // umjesto kontrolirane komponente
              type="text"
              ref={this.titleRef}
              placeholder="Title"
              onChange={this.onChange}
              className="post-title-input"
            />
          </div>
        </div>
        <div className="row">
          <div className="col col-sm-4">
            <textarea
              className="form-control"
              placeholder="Post body..."
              ref={this.bodyRef}
              type="text"
              onChange={this.onChange}
              rows={30}
            />
          </div>

          <div className="col col-sm-8">
            <ReactMarkdown
              source={this.state.markdownBody}
              className="mark-down-preview"
              escapeHtml={false}
            />
          </div>
        </div>
      </>
    );
  }
}

export default Post;

var Comments = require('./comments.jsx');
var CommentsForm = require('./form.jsx');
var CommentsBlock = React.createClass({
  getInitialState() {
    return {
      data: []
    }
  },
  loadComments() {
    $.ajax({
      url: '/comments',
      type: 'get',
      dataType: 'json',
      data: {
        commentable_type: this.props.commentable_type,
        commentable_id: this.props.commentable_id,
        limit: 3
      },
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  onSubmit(event, params) {
    event.preventDefault();
    if(!params) {
      return;
    }

    params.commentable_type = this.props.commentable_type;
    params.commentable_id = this.props.commentable_id;

    var _this = this;
    $.ajax({
      url: '/comments',
      dataType: 'json',
      type: 'POST',
      data: params,
      success: function(data) {
        var _data = _this.state.data.concat([data]);
        _this.setState({data: _data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.commentsURL, status, err.toString());
      }.bind(this)
    });
  },
  onDelete(event, id) {
    event.preventDefault();
    var _this = this;
    $.ajax({
      url: '/comments/' + id,
      dataType: 'json',
      type: 'DELETE',
      success: function(data) {
        var _data = _this.state.data.filter(function(obj) {
            return data.id !== obj.id;
        });
        _this.setState({data: _data});
      }.bind(this),
      error: function(xhr, status, err) {

      }.bind(this)
    });
  },
  componentDidMount() {
    this.loadComments();
  },
  render() {
    return(
      <div className="comments-block">
        <div className="row">
          <CommentsForm authenticityToken={this.props.authenticity_token}
            userLinkTo={this.props.userLinkTo} userAvatar={this.props.userAvatar} onSubmit={this.onSubmit} />
        </div>
        <div className="row">
          <div className="comments">
            <Comments data={this.state.data} onDelete={this.onDelete} />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = CommentsBlock;
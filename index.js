( function(){

	function Comment(userName,text,votes,commentList){
		this.userName = userName;
		this.text = text;
		this.votes = votes;
		this.commentList = commentList
	}

	Comment.prototype.upvote = function(){
		var commentList = JSON.parse(window.localStorage.getItem('commentList'))||[];
		this.votes = this.votes + 1
		commentList = findAndUpdateComment(commentList,this)
		createCommentView(commentList);
	}

	Comment.prototype.downvote = function(){
		var commentList = JSON.parse(window.localStorage.getItem('commentList'))||[];
		if(this.votes>0)
			this.votes = this.votes - 1
		commentList = findAndUpdateComment(commentList,this)
		createCommentView(commentList);
	}

	Comment.prototype.reply = function(userName,text){
		var reply = new Comment(userName,text,0,[]);
		this.commentList.push(reply)
	}

	Comment.prototype.save = function(){
		var commentList = JSON.parse(window.localStorage.getItem('commentList'))||[];
		commentList.push(this);
		createCommentView(commentList)
	}

	Comment.prototype.updateReplyList = function(){
		var commentList = JSON.parse(window.localStorage.getItem('commentList'))||[];
		// search for that comment in the list
		commentList = findAndUpdateComment(commentList,this)
		createCommentView(commentList)
	}

	function findAndUpdateComment(commentList,comment){
		for(var i = 0; i<commentList.length;i++){
			if(commentList[i].text == comment.text && commentList[i].userName == comment.userName)
				commentList[i] = comment
			if(commentList[i].commentList.length>0)
				findAndUpdateComment(commentList[i].commentList,comment)
		}
		return commentList;
	}

	function createCommentView(commentList){
		var docFrag = document.createDocumentFragment();
		docFrag.appendChild(showComments(commentList));
		document.getElementById('viewComments').innerHTML = "";
		document.getElementById('viewComments').appendChild(docFrag);
		window.localStorage.setItem('commentList',JSON.stringify(commentList));

	}

	function createComment(userName,text,votes){
		var comment = new Comment(userName,text,votes,[]);
		comment.save()
		return comment
	}

	function showComments(commentList){
		var mainUL = document.createElement("ul");
		for(var i=0;i<commentList.length;i++){
			var comment = new Comment(commentList[i].userName,commentList[i].text,commentList[i].votes,commentList[i].commentList)	
			var li = createLi(comment,i)
			mainUL.appendChild(li)
			if(commentList[i].commentList.length>0){
				mainUL.appendChild(showComments(commentList[i].commentList))
			}
		}
		return mainUL
	}

	function createLi(comment,index){
		// main li element
		var li = document.createElement("li");

		// main div for the li element
		var mainDiv = document.createElement("div");

		//commentDiv which will have comment and username
		var commentDiv = document.createElement("div");
		var commentNameAndText = document.createTextNode(comment.userName+": " + comment.text);
		commentDiv.appendChild(commentNameAndText)

		// votes div which will have votes along with upvote and downvote
		var votesDiv  = document.createElement("div");
		var votes = document.createTextNode("Votes:"+comment.votes);
		var upvoteBtn = document.createElement("button");
		upvoteBtn.innerHTML = 'Upvote';
		upvoteBtn.onclick = function(){
			comment.upvote();
		}
		var downVoteBtn = document.createElement("button");
		downVoteBtn.innerHTML = 'Downvote';

		downVoteBtn.onclick = function(){
			comment.downvote();
		}
		votesDiv.appendChild(votes);
		votesDiv.appendChild(upvoteBtn);
		votesDiv.appendChild(downVoteBtn);

		//reply username div
		var userNameDiv = document.createElement("div")
		var userName = document.createTextNode("Username:")
		var usernameInput = document.createElement("input");
		userNameDiv.appendChild(userName)
		userNameDiv.appendChild(usernameInput)

		// reply comment div
		var replyCommentDiv = document.createElement("div")
		var commentText = document.createTextNode("Comment:")
		var commentInput = document.createElement("input");
		replyCommentDiv.appendChild(commentText)
		replyCommentDiv.appendChild(commentInput)

		//reply post button which will create a new comment
		
		var postReplyBtn = document.createElement("button")
		postReplyBtn.innerHTML = "POST"
		postReplyBtn.onclick = function(){
			var content = commentInput.value
			var user = usernameInput.value
			var reply = new Comment(user,content,0,[])
			comment.commentList.push(reply)
			comment.updateReplyList()
		}

		// reply Div which will show up on click of reply button
		var replyDiv = document.createElement("div");
		
		var hiddenReplyDiv = document.createElement("div")
		hiddenReplyDiv.style.cssText = 'display:none'
		hiddenReplyDiv.appendChild(userNameDiv)
		hiddenReplyDiv.appendChild(replyCommentDiv)
		hiddenReplyDiv.appendChild(postReplyBtn)


		var replyBtn = document.createElement("button")
		replyBtn.innerHTML = 'Reply';
		replyBtn.onclick = function(){
			replyBtn.style.cssText = 'display:none';
			hiddenReplyDiv.style.cssText = 'display:block';
		}
		replyDiv.appendChild(replyBtn);
		replyDiv.appendChild(hiddenReplyDiv);

		
		mainDiv.appendChild(commentDiv)
		mainDiv.appendChild(votesDiv)
		mainDiv.appendChild(replyDiv)
		li.appendChild(mainDiv)
		return li;
	}

	document.getElementById('post').addEventListener('click',function(){
		var userName = document.getElementById('userName').value;
		var content = document.getElementById('joinDiscussion').value;
		createComment(userName,content,0)
	})

	var commentList = JSON.parse(window.localStorage.getItem('commentList'))||[];
	if(commentList.length)
		createCommentView(commentList)

})()
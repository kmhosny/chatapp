# chatapp

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.15.1.

## Build & development

Run `gulp` for building and `gulp serve` for preview.

## Testing

Running `gulp test` will run the unit tests with karma.



##Design:
	-	since the app will not use a real backend server there had to be a way simulate the databases and the backend server.
	-	for the databases, localStorage has been used to simulate the databases concept as much as possible, data is saved as JSON objects.
		- users: {username:string ,id:integer,isOnline:boolean}, and an index counter to keep track of IDs
		- conversations: {convId:integer,participants:[userId],name[usernames],lastTimeStamp:date,isRead[booleans]} and index counter, name is for the conversation name and isRead
		to mark if user x read last message or not, lastTimeStamp for the last time the conversation was updated
		- messages: {msgId:integer ,convId:integer, text:{string,messageType:integer},timestamp:date} and index counter, text is an object that holds the text
		of the message and type of message to differentiate with image messages to be able to recognise if last message was a text or image to display different 
		hints of last message sent.
	- for the backend layer, several modules has been created to communicate directly with the localStorage to levitate these issues from the frontend controllers,
	there is a userStorage module, messagesModule, conversationsModule and image upload module, imgurUpload to imgur servers
	- on top of these modules lies a backend module which is the layer between frontend and backend layers mentioned above, handles the requests from frontend asking
	for data and retrieves it as well as sending https requests to imgurUpload module and returning with the result.
	- 	the was built using gulp and bower package manager for ease of use, the dist folder should contain last working version of the chatting app.

##How to use:
	-	login with any username, if it's not in localStorage it will be created and logged it, if it's already there then it will login directly.
	- 	send and receive message in the specific browser since it uses localStorage, multiple tabs in the same brower can be opened and the change will reflect
		if all of them.
	- 	can send images -don't upload personal photos since it's sent to imgur-, and text with emoticons thanks to the emojify library -very neat and simple to use.
	-	refresh the conversation page will log you out.

## Interface design:
	-	the UI is very minimal and to the point, navigation for contacs and navigation for chat messages, buttons for sending images and emoticons.

/*

Jappix - An open social platform
These are the anonymous mode JS script for Jappix

-------------------------------------------------

License: AGPL
Authors: Valérian Saliou, Emmanuel Gil Peyrot
Contact: http://project.jappix.com/contact
Last revision: 08/12/10

*/

// Connected to an anonymous session
function anonymousConnected(con) {
	logThis('Jappix (anonymous) is now connected.', 3);
	
	// Connected marker
	CURRENT_SESSION = true;
	
	// Not resumed?
	if(!RESUME) {
		// Create the app
		createTalkPage();
		
		// Send our first presence
		firstPresence('');
		
		// If no domain is defined, we assume this must be ours
		if(ANONYMOUS_ROOM.indexOf('@') == -1)
			ANONYMOUS_ROOM = ANONYMOUS_ROOM + '@' + HOST_MUC;
		
		// Create the new groupchat
		checkChatCreate(ANONYMOUS_ROOM, 'groupchat');
		
		// Remove some nasty elements for the anonymous mode
		$('.tools-mucadmin, .tools-add').remove();
	}
	
	// Resumed
	else {
		presenceSend();
		
		// Change the title
		updateTitle();
	}
	
	// Remove the waiting icon
	removeGeneralWait();
}

// Disconnected from an anonymous session
function anonymousDisconnected() {
	logThis('Jappix (anonymous) is now disconnected.', 3);
	
	// Reconnect pane
	if(CURRENT_SESSION)
		createReconnect('anonymous');
}

// Logins to a anonymous account
function anonymousLogin(server) {
	try {
		// We define the http binding parameters
		oArgs = new Object();
		oArgs.httpbase = HOST_BOSH;
		
		// We create the new http-binding connection
		con = new JSJaCHttpBindingConnection(oArgs);
		
		// And we handle everything that happen
		con.registerHandler('message', handleMessage);
		con.registerHandler('presence', handlePresence);
		con.registerHandler('iq', handleIQ);
		con.registerHandler('onconnect', anonymousConnected);
		con.registerHandler('onerror', handleError);
		con.registerHandler('ondisconnect', anonymousDisconnected);
		
		// We set the anonymous connection parameters
		oArgs = new Object();
		oArgs.domain = server;
		oArgs.authtype = 'saslanon';
		oArgs.resource = JAPPIX_RESOURCE + ' Anonymous';
		oArgs.secure = true;
		
		// We connect !
		con.connect(oArgs);
		
		// Change the page title
		pageTitle('wait');
	}
	
	catch(e) {
		// Logs errors
		logThis('Error while anonymous loggin in: ' + e, 1);
		
		// Reset Jappix
		anonymousDisconnected();
		
		// Open an unknown error
		openThisError(2);
	}
	
	finally {
		return false;
	}
}

// Plugin launcher
function launchAnonymous() {
	logThis('Anonymous mode detected, connecting...', 3);
	
	// We add the login wait div
	showGeneralWait();
	
	// Get the vars
	if(LINK_VARS['r'] && (LINK_VARS['n'] !== ''))
		ANONYMOUS_ROOM = LINK_VARS['r'];
	
	if(LINK_VARS['n'] && (LINK_VARS['n'] !== ''))
		ANONYMOUS_NICK = LINK_VARS['n'];
	
	// Fire the login action
	anonymousLogin(HOST_ANONYMOUS);
}

// Launch this plugin!
$(document).ready(launchAnonymous);

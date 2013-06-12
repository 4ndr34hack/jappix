/*

Jappix - An open social platform
These are the origin JS script for Jappix

-------------------------------------------------

License: AGPL
Author: Valérian Saliou
Last revision: 12/06/13

*/

// Checks if the URL passed has the same origin than Jappix itself
function isSameOrigin(url) {
	/* Source: http://stackoverflow.com/questions/9404793/check-if-same-origin-policy-applies */

    var loc = window.location,
        a = document.createElement('a');

    a.href = url;

    return (!a.hostname	|| (a.hostname == loc.hostname))	&&
           (!a.port		|| (a.port == loc.port))			&&
           (!a.protocol	|| (a.protocol == loc.protocol));
}
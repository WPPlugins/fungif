=== Fungif The Awesome GIFs ===
Contributors: Funpica.com
Tags: gifs, comment, reaction, funny
Requires at least: 3.0.1
Tested up to: 4.6.1
Stable tag: 2.0
Donate link: http://oxwall.myjuicymango.com/donate
License: GPLv2 
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Fungif allows post reader to leave awesome GIF comments, and webmaster add awesome GIFs to their post.

== Description ==

GIF increases the likelihood of receiving a response by 30% and conversations that include GIFs also last twice as long as conversations without GIFs on the popular dating app, according to Tinder.
This plugin allows post readers leave awesome funny GIF comments on your posts. thousands of funny GIFs are ready, you don't have to upload yourself, please see the screenshots.

== Third party API ==

This plugin includes 2 third party APIs
(1) https://www.funpica.com/api/oxwall/expanded_panel.php
	This is the api to call the "GIF Panel" which post readers to find the awesome GIF to attach to the comments.
	To make a successful call to the API, the plugin will provide the calling window's url (your website's root url), so that when the post reader click a GIF on the GIF Panel, the Panel will send a callback to the calling window so that the calling window can attach the GIF to the comment form.
	The API host (funpica.com) does not collect any information from the API call. 
(2) https://www.funpica.com/api/oxwall/viewer.php
	This is the api to call GIF full-size viewer
	When the post viewer click on a GIF on the post comment, the plugin will bring up a floating full-size GIF viewer.
	Making a call to this API, GIF's ID will be provided, which is used to tell the GIF viewer which GIF to show. 
	The API host (funpica.com) does not collect any information from the API call. 

== Installation ==

1. copy the 'Fungif' directory to your wp-content/plugins directory.
2. go to your wp-admin and enable the Fungif plugin in the wordpress plugins admin.
3. once the plugin is enabled you should see the Fungif logo beside the comment button!


== Screenshots ==
1. Add a GIF to comment
2. Comments with GIFs
3. Fungif Panel (select GIF to insert to the comment)
4. Fungif Panel (select GIF to insert to the post)
5. GIF in post editor
6. Post with GIFs


== Upgrade Notice ==

** No updates yet!

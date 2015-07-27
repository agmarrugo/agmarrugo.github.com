---
layout: post
title: "My blog post writing workflow with Dropbox and Hazel"
author: Andres Marrugo
date: 2012-10-15 23:44
comments: true
published: true
categories: [mac, blogging]
---

It may seem that, for the most part, I've been blogging about blogging. No matter how pointless it seems, I *do* think that this could prove useful to someone, in the same way I have benefited from others while setting up this site[^foo2].

One of the things I like about having an [Octopress](http://octopress.org/ "Octopress") driven `txt`-only blog is that I have the liberty to set things my way. The topic I am addressing here is that of writing blog posts on different devices[^foo1] with the help of Dropbox[^foo5] and [Hazel][hazel]. I'm still working out the whole remote blogging thing, this is but the first stage of a soon-to-be remote blogging workflow with Octopress. 

<!--more--> 

[^foo1]: My Mac or my iPod touch.

<!-- When I say "different devices" I actually mean three:

- A Macbook Pro at the office, almost always on.
- A Mac Mini at home, often on, but not necessary logged in my user.
- An iPod Touch, always with me. -->

## My blog post writing workflow ##

Ideally any blog post starts with an idea that I write down in a text file named `runx-blog_ideas-qqq.txt`[^foo3]. This is done either on any of the two Macs using [nvAlt](http://brettterpstra.com/project/nvalt/ "nvALT 2.1 - Notational Velocity Fork") or on my iOS device using any text editor[^foo4]. I *always* write in [Markdown](http://daringfireball.net/projects/markdown/ "Daring Fireball: Markdown") (technically I *mostly* write in [Multimarkdown](http://fletcherpenney.net/multimarkdown/ "MultiMarkdown"), but that's another thing). 

After I decide that this idea is ready to become a draft, I create a text file that follows the same name convention for Octopress (``2012-10-14-Post-title.text``) on a folder named ``_drafts`` that resides in the ``source``. You might have noticed that the extension is not ``.markdown`` and that is because I was having issues [making Hazel read the contents of markdown files](http://brettterpstra.com/fixing-spotlight-indexing-of-markdown-content/ "Fixing Spotlight indexing of Markdown content - Brett Terpstra"). So I opted for ``.text`` which is technically the same as ``.txt``, but I would differentiate them as drafts and most *importantly* [Hazel will be able to do its magic](http://macsparky.com/2009/6/3/sorting-and-moving-documents-with-hazel.html "Sorting and Moving Documents with Hazel — MacSparky").

The underscore (``_``) on the name of the drafts folder is so that it won't be deployed, just as the posts folder

	source/
	|__ _drafts/
	|__ _posts/
	
With the help of [Typinator](http://www.ergonis.com/products/typinator/ "Typinator - the fastest text expander in town") on my mac or [Textexpander](http://smilesoftware.com/TextExpander/touch/index.html "TextExpander touch: iOS Typing Shortcuts for iPhone and iPad") on my iPod I create the yaml header like this

	--- 	layout: post 	title: "Post title" 	date: 2012-10-14 23:28 	author: Andres Marrugo 	comments: true 	published: false 	categories: [blog] 	--- 

Notice that ``published: false``, which means *it is a draft*. When I'm finished with the post I'll change it to ``true``. 


### The Syncing ###

The Syncing is done via Dropbox, because any iOS text editor comes with Dropbox support. iCloud has still a long way to go. Because my octopress folder does not reside in the Dropbox folder I made symlinks on my Mac to the ``_posts``, ``_drafts``, and ``images`` folders so they get synced 

	ln -s ~/octopress/source/_posts/ ~/Dropbox/PlainText/blog/_posts
	ln -s ~/octopress/source/images/ ~/Dropbox/PlainText/blog/images
	ln -s ~/octopress/source/_drafts/ ~/Dropbox/PlainText/blog/_drafts
	
On any other machine they become actual folders.

### Automating with Hazel

Ideally I would like to change the ``published: false`` to ``true`` and have it posted to my site, but it still requires some workarounds and this is why for the time being my hazel magic script only moves the file to the ``_posts`` folder when the published option changes to ``true``. I then generate the site and deploy it manually, but this will soon be automated as well.

There are actually two Hazel rules for this. It first monitors the ``_drafts`` folder for files whose content contains the phrase ``published: true``. When this happens the file gets moved to the folder ``_posts``.

<div class="aic" style="width:500px"><a href="http://www.flickr.com/photos/copiancestral/7913589162/" title="drafts-move-to-posts-hazel by copiancestral, on Flickr"><img src="http://farm9.staticflickr.com/8038/7913589162_551eed930a.jpg" width="500" height="243" alt="drafts-move-to-posts-hazel"></a><br>Move file to _posts folder.</div>

Then the second rule is for the ``_posts`` folder. If the extension is ``text`` (which means it was a draft that recently got moved) it will run a shell script.

<div class="aic" style="width:500px"><a href="http://www.flickr.com/photos/copiancestral/7913591478/" title="posts-modify-latest-post-hazel by copiancestral, on Flickr"><img src="http://farm9.staticflickr.com/8458/7913591478_f75d933161.jpg" width="500" height="356" alt="posts-modify-latest-post-hazel"></a><br>Modify latest post.</div>


The shell script is the following. What it does is to replace the date with the current date -- you see, several days could've passed since I created the draft -- in both the yaml header and the file name. And the other thing it does is to change the extension to ``.markdown``.  

{% codeblock Move to posts folder lang:bash  %}

# Replace yaml header date to current date 
sed "s/[0-9]\{4\}.*:[0-9]\{2\}/`date '+%Y-%m-%d %H:%M'`/" $1 > tmp && mv tmp $1

mydate=$(date '+%Y-%m-%d')
fname=$(echo $1 | sed "s/text/markdown/")
# Rename file to current date
mv $1 `echo $fname | sed "s/[0-9]\{4\}.*-[0-9]\{2\}-[0-9]\{2\}/$mydate/"`
	
{% endcodeblock %}

It may look like there's not much automation, but if you think that this runs on my Mac while I'm writing it in my iPod Touch, then it gets really interesting, and the possibilities are almost infinite. Besides, updating the post date, moving files and changing extensions are quite tedious tasks by themselves. To make it automatically generate and deploy the site I'd have to add several more lines to the script, but I'm ok with how it is for now. 

[^foo2]: Special thanks to [Neil Smithline][neilsmithline] for helping me out on [the two blogs one domain issue][github].

[^foo3]: In some future post I'll explain my note taking workflow and how I name files. In this case I use [Merlin Mann's `q` trick](http://www.kungfugrippe.com/post/453204090/q-trick) and the `runx` stands for running notes.

[^foo4]: I use several editors, but mainly [Byword](http://bywordapp.com/ "Byword &bull; A Simple Text Editor for Mac and iOS"), [WriteUp ](http://writeup.prasannag.com/ "WriteUp - with Dropbox"), [Elements](http://www.secondgearsoftware.com/elements/ "Elements &mdash; Dropbox powered text editor for iPhone, iPad and iPod touch from Second Gear"), and [Nebulous Notes](http://nebulousapps.net/ "Nebulous Notes").

[^foo5]: I can't really write this post without mentioning two posts that served as inspiration and reference: ["Synced and scheduled blogging with octopress"][instant-thinking] and ["My Dropbox Writing Workflow."][macstories]

[github]: https://github.com/imathis/octopress/issues/708
[neilsmithline]: http://www.neilsmithline.com/
[andresmarrugo]: http://andresmarrugo.net/blog/2012/08/15/hello-world/
[candlerblog]: http://www.candlerblog.com/2012/04/01/remote-octopress-workflow/
[instant-thinking]: http://instant-thinking.de/2012/08/03/synced-and-scheduled-blogging-with-octopress/
[macstories]: http://www.macstories.net/stories/my-dropbox-writing-workflow/ "My Dropbox Writing Workflow"
[hazel]: http://www.noodlesoft.com/hazel.php "Noodlesoft | Hazel"

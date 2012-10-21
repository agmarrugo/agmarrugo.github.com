---
layout: post
title: "a service for writing day one footnotes inline"
author: Andres Marrugo
date: 2012-10-01 22:31
comments: true
published: true
categories: mac
---

I recently wrote about [inserting footnotes in Day One](http://andresmarrugo.net/blog/2012/09/29/footnotes-in-dayone/) and how it could be achieved with the new markdown support. I realize that ideally Day One should support multimarkdown footnotes, but this has not arrived yet. It could well be planned for a future release, but I'll stick to my solution for the mean time.

One of the tedious things about my solution to footnotes in [Day One](http://dayoneapp.com/) is that you have to *do* everything manually. The insertion of the footnotes *plus* the formatting, not to mention keeping count of the number of footnotes. For one or two footnotes this doesn't seem like a big issue. But for several more it gets complicated.[^1] You have to put the superscript (``^``), the number of the footnote, the horizontal line (which I think necessary) and the footnote itself. Therefore, I thought I could automate this--somewhat.

<!--more--> 

## Here comes the magic script

So I though I'd ask [Brett Terpstra](http://brettterpstra.com/)[^2] for advice, to see if this could be automated somehow. At the moment he's probably quite busy with the premiere of his book [60 Mountain Lion Tips](http://60tips.com/), which promises "to turn you into a Mac ninja". 

Despite that, I remembered he had released a service for [writing multimarkdown footnotes inline](http://brettterpstra.com/a-service-for-writing-multimarkdown-footnotes-inline/).  The idea is that you write your text like this

	This is the regular text(*This is the footnote*), and you can drop the footnote in at any point.

You run the service and you get something like this

	This is the regular text[^fn1], and you can drop the footnote in at any point.

	[^fn1]: This is the footnote

According to Brett "one nice thing about this syntax is that--if you’re previewing as you write--it italicizes the output to differentiate it until you’ve used the service to move it out of the main text." So it's a win-win situation. 

I decided I would modify the script, even though I am a *neophyte* in ruby. The modification is practically nothing, so all the credit goes to Brett. Here's the modified script

<script src="https://gist.github.com/3814178.js"> </script> 

**Update** on Oct 2, 2012 -- Brett took a look at the code and gave it the thumbs up.

I will definitely not go into the details of the script, but I've tried it and it works. The only thing I didn't bother to make work was the part of the code that made sure that footnote reference titles aren’t duplicated if you have existing formatted footnotes in the document. It's commented out, but feel free to further modify it or make any suggestions. 

For the same input as above you should get this

	This is the regular text^1, and you can drop the footnote in at any point.

	****
	1. This is the footnote

Here's a [download link](http://d.pr/f/t4ff) so you can download it as a system service. You'll have to move it to ``~/Library/Services/``. Enjoy!


[^1]: I don't usually write long entries in Day One, but hey there's always a day when I feel *so* inspired, I could write a short story if I wanted to.
[^2]: Brett is a computer geek that makes awesome things (most for free) like [Marked](http://markedapp.com/) or [nvAlt](http://brettterpstra.com/project/nvalt/). He blogs at [brettterpstra.com](http://brettterpstra.com/), and for what it seems is one of the nicest guys on the internet.
---
layout: post
title: "Convert Image to PDF with Automator and Imagemagick"
date: 2012-10-18 22:30
author: Andres Marrugo
comments: true
published: true
categories: [mac, automation]
---

I often use [Imagemagick](http://www.imagemagick.org/script/index.php) for image manipulation[^fn2]. However, for simple conversion of an image to another format or similar things I have to go to the terminal and type something like the following

    convert somefile.png somefile.pdf

Which is quite simple, and much better than opening preview -> export[^fn1]->select pdf-> and hit save. But typing that for more than one image is *also* tedious. So, I decided I'd better create a service that would essentially do the following.

[^fn1]: "Save as" in the old days, prior to OS X 10.7.

[^fn2]: As a matter of fact, now that I've finally upgraded to Mountain Lion, Imagemagick stopped working. Had to reinstall with macports.

It would take the selected finder items, mainly images in ``png``, ``jpeg``, or whatever, and convert all of them to ``pdf``. Simple. <!--more-->  The automator service is shown in the following image. It does exactly what I've described.


<div class="aic" style="width:500px"><a href="http://www.flickr.com/photos/copiancestral/8099954950/" title="to-pdf-automator-script by copiancestral, on Flickr"><img src="http://farm9.staticflickr.com/8045/8099954950_8d97fab95f.jpg" width="500" height="252" alt="to-pdf-automator-script"></a><br>
Automator service.</div>


The shell script is quite simple. Because the ``convert`` command from Imagemagick is not a command in bash, I have to call it with the whole path. The rest of that one-liner is a [``sed``](http://en.wikipedia.org/wiki/Sed) call to substitute  whatever extension the input file has (with the [regex](http://en.wikipedia.org/wiki/Regular_expression "Regular expression - Wikipedia, the free encyclopedia") ``\..*``) to ``.pdf``, and that's it. Here's the script.

{% codeblock convert-to-pdf lang:bash  %}
for f in "$@"
do
  /opt/local/bin/convert "$f" `echo "$f"|sed "s/\..*/.pdf/"`
done
    {% endcodeblock %}

---
layout: post
title: "Date Commands"
date: 2014-12-07 22:49
author: Andres Marrugo
comments: true
published: true
categories: automation
---


[Dr. Drang recently shared][1] two date commands he uses for: i) calculating how many days have passed since a given date, and ii) another that returns the day of the year of the current date. 

I was mainly interested in the first one because I often have to do that calculation.[^fn1] Because the script can also compute the days remaining until a future date, you can imagine how handy it can be. For instance, if I'd like to know how many days until the day I start my vacations, I just run the script with a future date and it'll return a negative result in days. Or if I'd like to know how old I am in days.

<!-- more -->

<div class="aic" style="width:460px"><img src="https://dl.dropboxusercontent.com/u/5279729/blog-pics/Screenshot-date-commands-2014-12-07.jpg" alt="" width="" height="" border="0" /><br>
This is how old I am in days.</div>

I thought it would be something useful to have on my iPhone so I turned it into a [Pythonista](http://omz-software.com/pythonista/ "Pythonista") script that I run from [Drafts](http://agiletortoise.com/drafts/ "Drafts - Agile Tortoise"). If you want to know exactly what the script does go to [Dr. Drang's post][1], I just modified it a bit so that it runs from Drafts when you enter a date in the following format `DD MM YY` where `YY` is optional, it assumes current year. 

You can download the `ago.py` script from [this gist.](https://gist.github.com/agmarrugo/e74853dd3914513af1d2) The Drafts action is available [here.](http://drafts4-actions.agiletortoise.com/a/1PP)




[1]: http://www.leancrew.com/all-this/2014/12/two-little-date-commands/

[^fn1]: My solution is typically to google for a date calculator. Then I have to go through the links, and find the one I need. A bit cumbersome, but since I don't do this everyday I don't complain much. It just seems simpler to have it as a Drafts action.
---
layout: post
title: "Get Fridays"
description: A Python script for producing an outline for course with dates.
date: 2016-01-30 00:58
author: Andres Marrugo
comments: true
published: true
categories: blog
facebook:
    image: https://dl.dropboxusercontent.com/u/5279729/blog-pics/Screen%20Shot%202016-01-30%20at%2000.44.53.png
twitter_card:
    creator: agmarrugo
    type: summary
    image: https://dl.dropboxusercontent.com/u/5279729/blog-pics/Screen%20Shot%202016-01-30%20at%2000.44.53.png
---

So, I was preparing my clases for the upcoming semester and I wanted to produce an outline of the lectures with the corresponding date and topic. For instance I have a class that's once a week every Friday. I could look up the calendar and write every date, which is what I initially did. But then I though, I could write a script for this. And that's when I entered the rabbit hole.[^fn1]


[^fn1]: Don't we all?

The script I'm showing here went through several iterations. I had several difficulties until I got it to work. I wasn't pleased with it, so I fiddled a bit more. Later when I saw Dr Drang's post about [formatting multimarkdown tables with tabulate][1], I knew I had to use that. So I did. Here's the script.

[1]: http://leancrew.com/all-this/2016/01/formatting-multimarkdown-tables-with-numpy-and-tabulate/ "Formatting MultiMarkdown tables with NumPy and tabulate - All this"



```python get_fridays.py https://github.com/agmarrugo/PythonScripts/blob/master/get_fridays.py Link

import calendar
from tabulate import tabulate

c = calendar.Calendar(firstweekday=calendar.MONDAY)

year = 2016
months = [2,3,4,5]
monthName = {k: v for k,v in enumerate(calendar.month_abbr)}

listFridays = []
for month in months:

    monthcal = c.monthdatescalendar(year,month)  
    
    for week in monthcal:
        for day in week:
            if day.weekday() == calendar.FRIDAY and day.month == month:
                listFridays.append([monthName[day.month]+" "+str(day.day)," "," "])
                
headers = ["Date","Lecture","Lecture Topics"]

print tabulate(listFridays,headers,tablefmt='pipe')
```

As you can see, the script is quite simple. I give it the year and the months. The loops go over the months, and then the weeks and it looks up the friday of that week. On line 18, I have to append the white spaces ``" "`` and convert day to ``str`` in order to get three columns per day, so that tabulate gives me back a nifty formatted table. Another cool thing is that tabulate can also output in LaTeX format.

The script will produce this:

    | Date   | Lecture   | Lecture Topics   |
    |:-------|:----------|:-----------------|
    | Feb 5  |           |                  |
    | Feb 12 |           |                  |
    | Feb 19 |           |                  |
    | Feb 26 |           |                  |
    | Mar 4  |           |                  |
    | Mar 11 |           |                  |
    | Mar 18 |           |                  |
    | Mar 25 |           |                  |
    | Apr 1  |           |                  |
    | Apr 8  |           |                  |
    | Apr 15 |           |                  |
    | Apr 22 |           |                  |
    | Apr 29 |           |                  |
    | May 6  |           |                  |
    | May 13 |           |                  |
    | May 20 |           |                  |
    | May 27 |           |                  |

As you can see it works. However, by now you're wondering, but what about holidays. The script should be smart enough to exclude holidays. I am implementing this, but I'll leave it for a future post. When rendered looks something like this:

<div class="aic" style="width:460px"><img src="https://dl.dropboxusercontent.com/u/5279729/blog-pics/Screen%20Shot%202016-01-30%20at%2000.43.36.png" alt="" width="" height="" border="0" /><br></div>


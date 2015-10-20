---
layout: post
title: "Grading lab reports workflow"
description: Grading lab reports workflow using Python and Plain Text Files.
date: 2015-10-19 22:31
author: Andres Marrugo
comments: true
published: true
categories: [automation,academia]
facebook:
    image: https://farm6.staticflickr.com/5721/22134710389_db6f90e967.jpg
twitter_card:
    creator: agmarrugo
    type: summary
    image: https://farm6.staticflickr.com/5721/22134710389_db6f90e967.jpg
---


<div class="aic" style="width:320px"><a href="https://www.flickr.com/photos/50652826@N03/22134710389"><img src="https://farm6.staticflickr.com/5721/22134710389_db6f90e967.jpg" alt="Grades 2 CSV with Python." width="320px" height="" border="0" /></a></div>

Despite all the tools and applications at my disposal, I like to write my comments, feedback and grade the lab reports I get from my students using plain text files. To be precise, [markdown][md] formatted plain text files md.

[md]: https://daringfireball.net/projects/markdown/ "Daring Fireball: Markdown" 

<!-- more -->

I typically write in a plain text file using [nvalt][nvalt] or [textmate][mate] as my text editor. With the help of a [TextExpander][TE] snippet I print out the class list and the other fields I must fill out, typically a general comment/feedback and the grade. The snippet produces something like this:[^fn1]

	tags:#vision,#lab

	- Pérez Ramos, Miguel A.
		- Comentario: 
		- Nota:
	
	- Beleño Hernández, Liliana P.
		- Comentario: 
		- Nota: 

	... Other parts look the same ...


After filling it out I get something like the following:

	tags:#vision,#lab

	- Pérez Ramos, Miguel A.
		- Comentario: El informe está completo y bien argumentado. Se demuestra que se realizó la práctica a cabalidad. Concluye adecuadamente y cita las referencias consultadas.
		- Nota: 5.0

	- Beleño Hernández, Liliana P.
		- Comentario: El informe comienza bien, pero termina abruptamente. No se mencionan los aspectos relacionados con la lectura y tampoco se evidencia adecuadamente los resultados de la práctica. No hay bibliografía.
		- Nota: 3.5

	- Carrascal Mendez, Martín S.
		- Comentario: El informe es adecuado y cumple con el objetivo de la práctica.
		- Nota: 5.0	

This is easy to fill out, looks nice and is well formated. I can preview it - if I want – in [Marked][marked] or in any other markdown previewer. But the truth is, I'm fine viewing it just like that in plain text. The tedious part comes when I need to copy the grades from this file to a spreadsheet.

This is where [automating the boring stuff][automate] in python makes this a fun and interesting problem to spend an evening solving with a script. The following script takes an input text file like formatted like the one previously shown.


```python grades2csv.py https://gist.github.com/agmarrugo/5781fbf3d42f26cd2114 Link
#! /usr/local/bin/python
# -*- coding: utf-8 -*-
import re
import csv
import argparse

class REMatcher(object):
    """ A little class that returns the boolean result of calling match,
    and retains the matched groups for subsequent retrieval.

    Attributes
    ----------
    matchstring : The string to match
    match : Matching the regular expression, returns True/False
    group : Returns the matched groups with index i

    Modified from Paul McGuire, 
    http://stackoverflow.com/questions/2554185/match-groups-in-python
    """
    def __init__(self, matchstring):
        self.matchstring = matchstring

    def match(self,regexp):
        self.rematch = re.match(regexp, self.matchstring)
        return bool(self.rematch)

    def group(self,i):
        return self.rematch.group(i)

# construct the argument parse and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("input", help="path to the input text file")
# optional output csv file path
ap.add_argument("-o", "--output", help="path to the output csv file")
args = vars(ap.parse_args())

# Path to text file
filePath = args['input']

# Path to output file
if args['output']:
    fileCSVPath = args['output']
else:
    # If output file path is not provided
    fileCSVPath = args['input'].split('.')[0] + ".csv"

    
fileCSV = open(fileCSVPath,'w')
wr = csv.writer(fileCSV,quoting=csv.QUOTE_ALL)

# Write titles in csv file
wr.writerow(["Nombre","Nota","Comentario"])

with open(filePath,'r') as f:    
    
#   Iterate through all lines in f
    for line in f:
        m = REMatcher(line)

        if m.match(r"^-(.*$)"):
            Name = m.group(1)
        if m.match(r"^\t.*-.*Comentario:(.*$)"):
            Comment = m.group(1)
        if m.match(r"^\t.*-.*Nota:\s*(\d.*$)"):
            Grade = m.group(1)
            List = [Name,Grade,Comment]
            wr.writerow(List)
```

The usage is very simply, you just call the script ``grades2csv.py`` with the file you want to process. If you don't specify where the output should go (``-o option``) it defaults to the same path as the input text file.

I didn't bother on avoiding overwriting an existing csv file with the same name. I never name two text files with grades the same way.

About a year ago, I found out about this awesome trick of setting up a ``REMatcher class`` so that I can have an object that saves the matched string and returns ``True`` when it matches the regex. I've never gone back to implementing other regex paraphernalia in python. This works and I stick with it.

The script looks for three different matches in every line of the input file. One for a line that starts with a dash (``^-(.*$)``), capturing the name of the student (``m.group(1)``). The second, that matches the word ``Comentario``(``"^\t.*-.*Comentario:(.*$)"``) and captures the comment, and the third that captures the grade (``"^\t.*-.*Nota:\s*(\d.*$)"``). If the grade is not captured, then not a single item is written to the csv file (``wr.writerow(List)``).

If everything is well formated in the input file. The output is a nicely formatted csv file:

	"Nombre","Nota","Comentario"
	" Pérez Ramos, Miguel A.","5.0"," El informe está completo y bien argumentado. Se demuestra que se realizó la práctica a cabalidad. Concluye adecuadamente y cita las referencias consultadas."
	" Beleño Hernández, Liliana P.","3.5"," El informe comienza bien, pero termina abruptamente. No se mencionan los aspectos relacionados con la lectura y tampoco se evidencia adecuadamente los resultados de la práctica. No hay bibliografía."
	" Carrascal Mendez, Martín S.","5.0"," El informe es adecuado y cumple con el objetivo de la práctica."
	" Piñeres De La Rosa, Néstor N.","4.7"," El marco teórico apunta a lo necesario, pero con las citas correspondientes. Muy bien por utilizar otras imágenes. Los comentarios son oportunos. Una discusión un poco más extensa sobre los distintos tipos de filtros que se implementaron en la última parte es deseable, ""prewitt"", ""sobel"", etc."
	" Daza Beltran, Juan A.","3.5"," El informe se ajusta a lo mínimo. Debería tener una discusión de resultados más extensa u observaciones del proceso de filtrado con diferentes filtros. Termina abruptamente. No hay bibliografía."

Which looks like this when viewed as a spreadsheet:

<div class="aic" style="width:600px"><img src="https://dl.dropboxusercontent.com/u/5279729/blog-pics/Screen%20Shot%202015-10-14%20at%2000.31.02.png" alt="" width="" height="" border="0" /><br></div>

You might be wondering, but why go through all this trouble. Because I can, but mostly because I find spreadsheets useful, but I don't like to type data in them. I find it more productive to write continuously in a plain text file. I can use Textexpander and other tools more easily. And finally, why not let the computer do the work it's supposed to do - I'm no monkey.



[^fn1]: These are not the real names of my students.

[mate]: https://macromates.com/ "TextMate — The Missing Editor for Mac OS X"
[nvalt]: http://brettterpstra.com/projects/nvalt/ "nvALT - BrettTerpstra.com"
[TE]: https://smilesoftware.com/TextExpander/index.html "TextExpander: Mac Typing Shortcut Utility Saves You Time TextExpander: Mac Typing Shortcut Utility Saves You Time"
[marked]: http://marked2app.com/ "Marked 2 - Smarter tools for smarter writers"
[automate]: https://automatetheboringstuff.com/ "Automate the Boring Stuff with Python - Practical Programming for Total Beginners"
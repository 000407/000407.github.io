---
layout: page
title: Singlish Writer
permalink: /tools/singlishw
styles: ["singlish"]
scripts: ["singlish/writer", "singlish/scheme"]
---
<div id="writer-container">
    <textarea onkeyup="parse(event, this)" id="typearea"></textarea>
</div>
<div id="translit-scheme">
    <div id="translit-scheme-title">Transliteration Scheme <i class="fa fa-caret-right" aria-hidden="true" id="toggle-scheme" data-state="0"></i></div>
    <ul id="content" class="hidden"></ul>
</div>
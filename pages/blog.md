---
layout: page
title: A Blog of Random Things
permalink: /blog/
---

Here I keep a record of things that have been on my mind enough that I have decided to write a post about. Some of these are academic, while some are just a post that serves for my own self-reflection.

My posts have also been categorised <a href="{{ site.baseurl }}/categories/">here</a> for easier searching.

<ul class="listing">
{% for post in site.posts %}
  {% capture y %}{{post.date | date:"%Y"}}{% endcapture %}
  {% if year != y %}
    {% assign year = y %}
    <li class="listing-seperator">{{ y }}</li>
  {% endif %}
  <li class="listing-item">
    <time datetime="{{ post.date | date:"%Y-%m-%d" }}">{{ post.date | date:"%Y-%m-%d" }}</time>
    <a href="{{ site.baseurl }}{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a>
  </li>
{% endfor %}
</ul>

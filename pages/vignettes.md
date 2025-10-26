---
layout: page
title: Vignettes
permalink: /vignettes/
---

<ul class="listing">
<!-- <li class="listing-seperator">Posts with Dates</li> -->
{% for post in site.posts %}
  {% capture y %}{{post.date | date:"%Y"}}{% endcapture %}
  <li class="listing-item">
    <time datetime="{{ post.date | date:"%Y-%m-%d" }}">[{{ post.date | date:"%Y-%m-%d" }}]</time>
    <a href="{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a>
  </li>
{% endfor %}

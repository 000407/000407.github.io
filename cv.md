---
layout: page
title: Curriculum Vitae
permalink: /cv/
---

<div class="resume grid">
  <div class="col col-1-2" style="width: 33%;">
    <div class="content">
      <h5 class="section-heading"><i class='fa fa-user'></i> Info</h5>
      <ul class="bio-data">
        <li class="bio-data bio-data-name">Kānchana Sēnādheera</li>
        <li class="bio-data bio-data-location">Pilimathalawa, Kandy LK</li>
        <li class="bio-data bio-data-email">kanchana at senadheera dot net</li>
        <li class="bio-data bio-data-social">Social Links: <a href="#social_links">See Bottom</a></li>
      </ul>
      <h5 class="section-heading"><i class='fa fa-code'></i> Tech Proficiency</h5>
      <div id="tech-prof"></div>
      <h5 class="section-heading"><i class='fa fa-language'></i> Languages</h5>
      <ul class="language-prof">
        <li><span class="lang-prof-item"><span class="lang-name">Sinhala</span><span class="lang-prof-rating">- Native</span></span></li>
        <li><span class="lang-prof-item"><span class="lang-name">English</span><span class="lang-prof-rating">- Full Professional</span></span></li>
        <li><span class="lang-prof-item"><span class="lang-name">Japanese</span><span class="lang-prof-rating">- JLPT N3</span></span></li>
      </ul>
    </div>
  </div>
  <div class="col col-1-2" style="border-left: 1px solid black; margin-left: 1em; padding-left: 1em; width: 67%">
    <div class="content">
      <h4 class="section-heading"><i class='fa fa-address-card'></i> Profile</h4>
      <p>A Software Engineer in profession with a proven track record with <span id="exp"></span>+ years of experience in engineering applications that makes life easy. A versatile individual that always strives to go above and beyond expectations. Exposed to a wide and deep array of technologies and tools. Capable of tackling pretty much anything with an <strong><em>elegant solution</em></strong>. Capable and eager to <strong><em>research, learn</em></strong> as well as <strong><em>teach</em></strong>, <strong><em>train</em></strong> and <strong><em>mentor</em></strong>. A tech evangelist that truly believes &quot;<strong><em>developing software is and always should be an engineering discipline</em></strong>&quot;</p>
      <h4 class="section-heading"><i class='fa fa-flag-checkered'></i> Portfolio</h4>
      {%- include resume/portfolio.html -%}
      <h4 class="section-heading"><i class='fa fa-handshake-o'></i> Experience</h4>
      {%- include resume/experience.html -%}
      <h4 class="section-heading"><i class='fa fa-graduation-cap'></i> Education</h4>
      {%- include resume/education.html -%}
      <h4 class="section-heading"><i class='fa fa-certificate'></i> Certifications</h4>
        <ul class="custom-bullet">
          <li><span class="education-record"><span class="education-title">Certified Ethical Hacker (C&#124;EH)</span><b class="education-duration"> - 09/2020 - 09/2023</b></span></li>
          <li><span class="education-record"><span class="education-title">AWS Certified Soluctions Architect - Associate (AWS SAA-C02)</span><b class="education-duration"> - 12/2020 - 12/2023</b></span></li>
          <li><span class="education-record"><span class="education-title">Certified Information Systems Security Practitioner (CISSP)</span><b class="education-duration"> - Reading</b></span></li>
          <li><span class="education-record"><span class="education-title">Cisco Certified Network Associate (CCNA) Security</span><b class="education-duration"> - Reading</b></span></li>
        </ul>
      <h4 class="section-heading"><i class='fa fa-angellist'></i> Personal</h4>
        <ul class="personal">
          <li class="hobbies">Hobbies</li>
          <p class="hobbies tags" id="hobbies-tags"></p>
          <li class="traits">Traits that define me</li>
          <p class="traits tags" id="traits-tags"></p>
        </ul>
    </div>
  </div>
</div>

{%- include resume/dynamics.html -%}

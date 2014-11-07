Reveal.initialize({
  transition: 'linear',
  brackgoundTransition: 'slide',
  history: true,
  dependencies: [
    { src: 'components/reveal.js/lib/js/classList.js', condition: function() { return !document.body.classList; } },
    { src: 'components/reveal.js/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
    { src: 'components/reveal.js/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
    { src: 'components/reveal.js/plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
    { src: 'components/reveal.js/plugin/zoom-js/zoom.js', async: true, condition: function() { return !!document.body.classList; } },
    { src: 'components/reveal.js/plugin/notes/notes.js', async: true, condition: function() { return !!document.body.classList; } },
  ]
});

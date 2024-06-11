window.MathJax = {
    loader: {load: ['[tex]/physics']},
    options: {
        enableMenu: false
    },  
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      packages: {'[+]': ['physics']}
    },
    svg: {
      fontCache: 'global'
    }
  };
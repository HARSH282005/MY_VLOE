const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');
content = content.replace(/src="\/ch(\d+)\.jpg"/g, 'src="/ch$1.jpg?v=2"');
fs.writeFileSync('index.html', content);

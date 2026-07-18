const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const fontLinks = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Noto+Nastaliq+Urdu:wght@400;700&family=Sora:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
`;

if (!html.includes('fonts.googleapis.com')) {
    html = html.replace('</title>', '</title>' + fontLinks);
    fs.writeFileSync('index.html', html);
    console.log("Updated index.html with font links");
}

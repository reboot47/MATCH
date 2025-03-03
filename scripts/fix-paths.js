const fs = require("fs").promises;
const path = require("path");
const componentDir = path.resolve("/Users/reboot47/Desktop/LINEBUZZ/MATCH/deve/components/ui");

const files = [
  "tabs.tsx", "card.tsx", "popover.tsx", "label.tsx", 
  "radio-group.tsx", "dialog.tsx", "table.tsx", 
  "button.tsx", "select.tsx", "textarea.tsx", "input.tsx"
];

const fixAllUIComponentPaths = async () => {
  for (const file of files) {
    const filePath = path.join(componentDir, file);
    try {
      let content = await fs.readFile(filePath, "utf8");
      
      // Replace @/lib/utils with relative path
      content = content.replace(/from\s+["']@\/lib\/utils["']/g, "from \"../../lib/utils\"");
      
      // Replace @/components/ui imports with relative imports
      content = content.replace(/from\s+["']@\/components\/ui\/(.*?)["']/g, "from \"./$1\"");
      
      await fs.writeFile(filePath, content, "utf8");
      console.log(`Updated ${file}`);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }
  
  console.log("All UI component imports updated successfully");
};

fixAllUIComponentPaths();
